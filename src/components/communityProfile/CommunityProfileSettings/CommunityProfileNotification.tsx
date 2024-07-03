import React from 'react'

const CommunityProfileNotification = () => {
  return (
    <div className="py-10 px-12 flex flex-col gap-10">
      {/* Notification  */}
      <div className="flex justify-between text-black ">
        <div className="flex flex-col gap-2 max-w-md">
          <h6 className="font-bold text-lg">Push Notifications</h6>
          <label className="font-medium ">
            Get push notifications to find out what’s going on when you’re not on unibuzz. You can turn them off anytime.
          </label>
        </div>
        <div className="inline-flex items-center ">
          <div className="relative inline-block w-8 h-4 rounded-full cursor-pointer">
            <input
              defaultChecked
              id="switch-1"
              type="checkbox"
              className="absolute w-8 h-4 transition-colors duration-300 rounded-full appearance-none cursor-pointer peer bg-gray-dark checked:bg-blue-500 peer-checked:border-blue-500 peer-checked:before:bg-blue-500"
            />
            <label
              htmlFor="switch-1"
              className="before:content[''] absolute top-2/4 -left-1 h-5 w-5 -translate-y-2/4 cursor-pointer rounded-full border border-blue-gray-100 bg-white shadow-md transition-all duration-300 before:absolute before:top-2/4 before:left-2/4 before:block before:h-10 before:w-10 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity hover:before:opacity-10 peer-checked:translate-x-full peer-checked:border-blue-500 peer-checked:before:bg-blue-500"
            >
              <div className="inline-block p-5 rounded-full top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4" data-ripple-dark="true"></div>
            </label>
          </div>
        </div>
      </div>
      {/* Notification  */}
      <div className="flex justify-between text-black ">
        <div className="flex flex-col gap-2 max-w-md">
          <h6 className="font-bold text-lg">Email Notifications</h6>
          <label className="font-medium ">Get emails to find out what’s going on when you’re not on unibuzz. You can turn them off anytime.</label>
        </div>
        <div className="inline-flex items-center ">
          <div className="relative inline-block w-8 h-4 rounded-full cursor-pointer">
            <input
              defaultChecked
              id="switch-1"
              type="checkbox"
              className="absolute w-8 h-4 transition-colors duration-300 rounded-full appearance-none cursor-pointer peer bg-gray-dark checked:bg-blue-500 peer-checked:border-blue-500 peer-checked:before:bg-blue-500"
            />
            <label
              htmlFor="switch-1"
              className="before:content[''] absolute top-2/4 -left-1 h-5 w-5 -translate-y-2/4 cursor-pointer rounded-full border border-blue-gray-100 bg-white shadow-md transition-all duration-300 before:absolute before:top-2/4 before:left-2/4 before:block before:h-10 before:w-10 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity hover:before:opacity-10 peer-checked:translate-x-full peer-checked:border-blue-500 peer-checked:before:bg-blue-500"
            >
              <div className="inline-block p-5 rounded-full top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4" data-ripple-dark="true"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityProfileNotification
