import type { Metadata } from "next";
import MotorTradeHome from "./_client";

export const metadata: Metadata = {
  title: "Motor Trade Lead Generation",
  description:
    "Get more customers for your motor trade business. We generate leads for MOT bookings, servicing, bodywork, repairs, tyres, and more across the UK.",
};

export default function MotorTradePage() {
  return <MotorTradeHome />;
}
