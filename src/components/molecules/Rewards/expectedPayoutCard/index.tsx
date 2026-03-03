const ExpectedPayoutCard = ({ amount }: { amount: number }) => {
  return (
    <div className="flex flex-col gap-3">
      <h6 className="text-[20px] font-bold font-poppins text-neutral-700">Expected Payout</h6>
      <p className="text-sm font-normal text-neutral-700">
        Your gift card worth <span className="font-bold">₹{amount}</span> from last month’s rewards will be sent to your login email. This may take
        several business days.
      </p>
    </div>
  )
}

export default ExpectedPayoutCard
