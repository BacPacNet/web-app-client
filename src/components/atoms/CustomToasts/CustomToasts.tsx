import { MESSAGES } from '@/content/constant'
import React from 'react'
import toast from 'react-hot-toast'

import { AiOutlineClose } from 'react-icons/ai'

// export function showCustomToast(message: string, onDismissLabel: string = 'Dismiss') {
//   toast.custom(
//     (t) =>
//       React.createElement(
//         'div',
//         {
//           className: `bg-green-200 w-full h-10 flex justify-between px-4 py-2 rounded-lg transition-transform duration-300 ${
//             t.visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
//           }`,
//         },
//         React.createElement('p', { className: 'text-green-500' }, message),
//         React.createElement(
//           'button',
//           {
//             onClick: () => toast.dismiss(t.id),
//             className: 'text-red-500 hover:text-red-700',
//           },
//           onDismissLabel
//         )
//       ),
//     {
//       position: 'bottom-center', // Position at the bottom
//       duration: 3000, // Optional: auto-dismiss after 3 seconds
//     }
//   )
// }

export function showCustomSuccessToast(message: string) {
  toast(
    (t) =>
      React.createElement(
        'div',
        {
          className:
            ' bg-success-100 text-xs md:text-sm flex justify-between items-center px-4 py-2 rounded-lg shadow-lg min-w-[500px] max-sm:min-w-[250px]',
          style: {
            margin: '0 auto',
            position: 'relative',
            // minWidth: '300px',
            // maxWidth: '800px',
            width: '80%',
            textAlign: 'center',
          },
        },
        React.createElement('p', { className: 'text-success-800' }, message),
        React.createElement(
          'button',
          {
            onClick: () => toast.dismiss(t.id),
            className: 'text-success-800',
          },
          React.createElement(AiOutlineClose, { size: 20 })
        )
      ),
    {
      position: 'bottom-center',
      duration: 30000,
      style: {
        margin: 0,
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
    }
  )
}

export function showCustomDangerToast(message: string) {
  toast(
    (t) =>
      React.createElement(
        'div',
        {
          className:
            'bg-destructive-100 text-xs md:text-sm flex justify-between items-center px-4 py-2 rounded-lg shadow-lg min-w-[500px] max-sm:min-w-[250px]',
          style: {
            margin: '0 auto',
            position: 'relative',
            // minWidth: '300px',
            // maxWidth: '800px',
            width: '80%',
            textAlign: 'center',
          },
        },
        React.createElement('p', { className: 'text-destructive-800' }, message || MESSAGES.SOMETHING_WENT_WRONG),
        React.createElement(
          'button',
          {
            onClick: () => toast.dismiss(t.id),
            className: 'text-destructive-800 ',
          },
          React.createElement(AiOutlineClose, { size: 20 })
        )
      ),
    {
      position: 'bottom-center',
      duration: 30000,
      style: {
        margin: 0,
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
    }
  )
}

// export function showCustomToast(message: string, onDismissLabel: string = 'Dismiss') {
//   toast(
//     (t) =>
//       React.createElement(
//         'div',
//         {
//           className: 'bg-green-200 w-full h-10 flex justify-between px-4 py-2 rounded-lg',
//         },
//         React.createElement('p', { className: 'text-green-500' }, 'message is here'),
//         React.createElement('button', { onClick: () => toast.dismiss(t.id) }, 'X')
//       ),
//     {
//       position: 'bottom-center', // Position at the bottom
//       duration: 3000, // Optional: auto-dismiss after 3 seconds
//     }
//   )
// }
// export function showCustomToast(message: string, onDismissLabel: string = 'Dismiss') {
//   toast(
//     (t) =>
//       React.createElement(
//         'span',
//         null,
//         message,
//         React.createElement(
//           'button',
//           {
//             onClick: () => toast.dismiss(t.id),
//             style: { marginLeft: '10px' }, // Optional styling for the button
//           },
//           onDismissLabel
//         )
//       ),
//     {
//       icon: React.createElement(FaBell, null),
//     }
//   )
// }
