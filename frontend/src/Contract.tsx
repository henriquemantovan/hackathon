"use client";

import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import * as React from "react";
import {} from "../../generated";
import { Address } from "viem";

type GetVendorsProps = {
  endereco: string;
};

interface ResultData {
  Tax?: number; // Use ? to denote that the property is optional
  RemainingCapacity?: number;
  error?: string;
}

const GetVendors: React.FC<GetVendorsProps> = ({ endereco }) => {
  let [vendor, setVendor] = useState("");
  const [resultData, setResultData] = useState<ResultData>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  vendor = endereco;
  const handleSetVendor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVendor(event.target.value);
  };

  const result = useReadContract({
    abi: energyMarketAbi,
    functionName: "vendors",
    address: "0x4B0FfA3E5506f655De25c77FfCCC42508eF7FB91",
    args: [vendor as Address],
  });

  useEffect(() => {}, [result]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (result.data) {
      setResultData({
        Tax: Number(result.data[1]),
        RemainingCapacity: Number(result.data[3]), // Corrigido de ReamainingCapacity para RemainingCapacity
      });
    } else {
      setResultData({ error: "No data found or an error occurred" });
    }
  };

  const serializeResultData = (data: any): any => {
    // Adicionada anotação de tipo de retorno
    if (typeof data === "bigint") {
      return data.toString();
    }
    if (Array.isArray(data)) {
      return data.map(serializeResultData);
    }
    if (typeof data === "object" && data !== null) {
      return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, serializeResultData(value)]));
    }
    return data;
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
      }}>
      <button type="submit">See vendor information</button>
      {isSubmitted && resultData && (
        <div>
          <h3>
            <div style={{ marginBottom: "-15px", textAlign: "center" }}>Tax: {serializeResultData(resultData.Tax)}</div>
            <br></br>
            <div style={{ textAlign: "center" }}>
              Remaining Capacity: {serializeResultData(resultData.RemainingCapacity)} {/* Remaining Capacity:{" "} */}
            </div>
          </h3>
        </div>
      )}
    </form>
  );
};
export default GetVendors;
