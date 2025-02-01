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
      duration: 3000,
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
      duration: 3000,
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

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info'
type ThemeMode = 'light' | 'dark'

const colorVariants = {
  default: {
    light: 'bg-neutral-50 text-neutral-800',
    dark: 'bg-neutral-900 text-white',
  },
  success: {
    light: 'bg-[#DCFCE7] text-green-800 border-green-200',
    dark: 'bg-[#16A34A] text-green-300 border-green-800',
  },
  error: {
    light: 'bg-[#FEE2E2] text-red-800 border-red-200',
    dark: 'bg-[#DC2626] text-red-300 border-red-800',
  },
  warning: {
    light: 'bg-[#FEF3C7] text-yellow-800 border-yellow-200',
    dark: 'bg-[#D97706] text-white border-yellow-800',
  },
  info: {
    light: '[#E9E8FF] text-blue-800 border-blue-200',
    dark: 'bg-[#6744FF] text-blue-300 border-blue-800',
  },
} as const

const buttonColorVariants = {
  default: {
    light: 'text-white bg-neutral-900',
    dark: 'text-neutral-900 bg-white ',
  },
  success: {
    light: 'text-white bg-green-600',
    dark: 'text-neutral-900 bg-white ',
  },
  error: {
    light: 'text-white bg-red-600',
    dark: 'text-neutral-900 bg-white ',
  },
  warning: {
    light: 'text-white  bg-[#F59E0B]',
    dark: 'text-neutral-900  bg-white ',
  },
  info: {
    light: 'text-white bg-blue-600',
    dark: 'text-neutral-900 bg-white ',
  },
} as const

const getColorClasses = (variant: ToastVariant, isDarkMode: boolean): string => {
  const theme: ThemeMode = isDarkMode ? 'dark' : 'light'
  return colorVariants[variant][theme]
}
const getButtonColorClasses = (variant: ToastVariant, isDarkMode: boolean): string => {
  const theme: ThemeMode = isDarkMode ? 'dark' : 'light'
  return buttonColorVariants[variant][theme]
}

interface ToastAction {
  label: string
  onClick: () => void
  isPrimary?: boolean
}

interface ToastProps {
  message: string
  variant?: ToastVariant
  isDarkMode?: boolean
  onClose: () => void
  actions?: ToastAction[]
}

const CustomToast: React.FC<ToastProps> = ({ message, variant = 'default', isDarkMode = false, onClose, actions = [] }) => {
  const colorClasses = getColorClasses(variant, isDarkMode)
  const buttonColors = getButtonColorClasses(variant, isDarkMode)
  return React.createElement(
    'div',
    {
      className: `fixed bottom-0 ${colorClasses} flex md:justify-between sm:gap-2 rounded-lg shadow-lg w-[350px] md-[450px] lg:w-[750px]  overflow-hidden`,
    },
    [
      React.createElement(
        'div',
        {
          className: 'flex items-center justify-between px-4 py-3',
          key: 'message-container',
        },
        [
          React.createElement(
            'p',
            {
              className: `${isDarkMode ? 'text-white' : `${colorClasses}`} text-sm font-medium`,
              key: 'message',
            },
            message
          ),
          React.createElement(
            'button',
            {
              onClick: onClose,
              className: `${colorClasses} p-1 rounded-full transition-colors bg-none absolute right-0 top-1/2 -translate-y-1/2`,
              key: 'close-button',
            },
            React.createElement(AiOutlineClose, { size: 16 })
          ),
        ]
      ),
      actions.length > 0 &&
        React.createElement(
          'div',
          {
            className: 'flex items-center justify-start px-2 py-2 md:mr-5 mr-4',
            key: 'actions-container',
          },
          actions.map((action, index) =>
            React.createElement(
              'button',
              {
                key: `action-${index}`,
                onClick: action.onClick,
                className: `px-3 py-1 mx-1 rounded-md text-sm font-medium ${
                  !action.isPrimary && !isDarkMode
                    ? `bg-white text-neutral-900`
                    : !action.isPrimary && isDarkMode
                    ? 'bg-transparent text-white border border-white rounded-md'
                    : buttonColors
                } transition-colors`,
              },
              action.label
            )
          )
        ),
    ]
  )
}

interface ToastOptions {
  variant?: ToastVariant
  isDarkMode?: boolean
  duration?: number
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  actions?: ToastAction[]
}

export const showToast = (message: string, options: ToastOptions = {}) => {
  const { variant = 'default', isDarkMode = false, duration = 3000, position = 'bottom-center', actions = [] } = options

  return toast(
    (t) =>
      React.createElement(CustomToast, {
        message,
        variant,
        isDarkMode,
        onClose: () => toast.dismiss(t.id),
        actions,
      }),
    {
      duration,
      position,
      style: {
        boxShadow: 'none',
        padding: 0,
      },
    }
  )
}
