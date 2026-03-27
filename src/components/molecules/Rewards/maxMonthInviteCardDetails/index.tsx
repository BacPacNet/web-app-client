const MaxMonthInviteCardDetails = () => {
  return (
    <div className="px-4 py-3 rounded-lg border-2 border-[#E5E7EB] bg-[#F3F4F6] flex justify-between items-center text-sm font-normal text-neutral-700">
      <p>
        After your first 20 invites, you’ll earn <span className="text-primary-500">₹100</span> for every additional{' '}
        <span className="text-primary-500">5 invites</span>. Subsequent milestones occur at <span className="text-primary-500">25</span>,{' '}
        <span className="text-primary-500">30</span>, <span className="text-primary-500">35</span>, and so on. Milestones will reset on the 1st of
        every month.
      </p>
    </div>
  )
}

export default MaxMonthInviteCardDetails
