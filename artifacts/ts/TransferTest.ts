/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  Contract,
  ContractState,
  TestContractResult,
  HexString,
  ContractFactory,
  EventSubscribeOptions,
  EventSubscription,
  CallContractParams,
  CallContractResult,
  TestContractParams,
  ContractEvent,
  subscribeContractEvent,
  subscribeContractEvents,
  testMethod,
  callMethod,
  multicallMethods,
  fetchContractState,
  ContractInstance,
  getContractEventsCurrentCount,
  TestContractParamsWithoutMaps,
  TestContractResultWithoutMaps,
} from "@alephium/web3";
import { default as TransferTestContractJson } from "../TransferTest.ral.json";
import { getContractByCodeHash } from "./contracts";

// Custom types for the contract
export namespace TransferTestTypes {
  export type Fields = {
    feeCollector: HexString;
  };

  export type State = ContractState<Fields>;
}

class Factory extends ContractFactory<
  TransferTestInstance,
  TransferTestTypes.Fields
> {
  getInitialFieldsWithDefaultValues() {
    return this.contract.getInitialFieldsWithDefaultValues() as TransferTestTypes.Fields;
  }

  at(address: string): TransferTestInstance {
    return new TransferTestInstance(address);
  }

  tests = {
    test: async (
      params: TestContractParamsWithoutMaps<
        TransferTestTypes.Fields,
        {
          firstTokenId: HexString;
          totalSellerFee: bigint;
          buyer: Address;
          secondTokenId: HexString;
          totalBuyerFee: bigint;
        }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "test", params);
    },
    deposit: async (
      params: TestContractParamsWithoutMaps<
        TransferTestTypes.Fields,
        { tokenId: HexString; amount: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "deposit", params);
    },
  };
}

// Use this object to test and deploy the contract
export const TransferTest = new Factory(
  Contract.fromJson(
    TransferTestContractJson,
    "",
    "7796da3c0835aefe1d6c85d2a226a6903d8dacd0272eebd45f220930d4bfa551"
  )
);

// Use this class to interact with the blockchain
export class TransferTestInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<TransferTestTypes.State> {
    return fetchContractState(TransferTest, this);
  }
}
