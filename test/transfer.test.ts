import { web3, Project, HexString, Address, ALPH_TOKEN_ID } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { Deposit, FeeCollector, Token1, Token2, Transfer, TransferTest,  } from '../artifacts/ts'

describe('integration tests', () => {
  beforeAll(async () => {
    web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)
    await Project.build()
  })

  async function tokenBalanceOf(address: Address, tokenId: HexString): Promise<bigint> {
    const nodeProvider = web3.getCurrentNodeProvider()
    const balances = await nodeProvider.addresses.getAddressesAddressBalance(address)
    if (tokenId === ALPH_TOKEN_ID) return BigInt(balances.balance)
    return BigInt(balances.tokenBalances?.find((t) => t.id === tokenId)?.amount ?? '0')
  }

  it('should transfer zero coin', async () => {
    const signer = await getSigner()
    const token1Result = await Token1.deploy(signer, {
      initialFields: {},
      issueTokenAmount: 100n,
      issueTokenTo: signer.address
    })
    const token2Result = await Token2.deploy(signer, {
      initialFields: {},
      issueTokenAmount: 100n,
      issueTokenTo: signer.address
    })
    const token1Id = token1Result.contractInstance.contractId
    const token2Id = token2Result.contractInstance.contractId

    const feeCollectorResult = await FeeCollector.deploy(signer, { initialFields: {} })
    const feeCollectorId = feeCollectorResult.contractInstance.contractId
    const transferTestResult = await TransferTest.deploy(signer, {
      initialFields: { feeCollector: feeCollectorId }
    })
    const contractId = transferTestResult.contractInstance.contractId
    const contractAddress = transferTestResult.contractInstance.address
    expect((await tokenBalanceOf(contractAddress, token1Id))).toEqual(0n)
    expect((await tokenBalanceOf(signer.address, token1Id))).toEqual(100n)

    await Deposit.execute(signer, {
      initialFields: {
        contract: contractId,
        tokenId: token1Id,
        amount: 1n
      },
      tokens: [{ id: token1Id, amount: 1n }]
    })
    expect((await tokenBalanceOf(contractAddress, token1Id))).toEqual(1n)
    expect((await tokenBalanceOf(signer.address, token1Id))).toEqual(99n)

    expect((await tokenBalanceOf(signer.address, token2Id))).toEqual(100n)
    await Transfer.execute(signer, {
      initialFields: {
        contract: contractId,
        firstTokenId: token1Id,
        totalSellerFee: 0n,
        secondTokenId: token2Id,
        totalBuyerFee: 0n
      },
      tokens: [{ id: token2Id, amount: 1n }] // we need to approve 1 token, otherwise it will return `NotEnoughApprovedBalance` error
    })

    expect((await tokenBalanceOf(contractAddress, token1Id))).toEqual(1n)
    expect((await tokenBalanceOf(signer.address, token2Id))).toEqual(100n)
  }, 20000)
})
