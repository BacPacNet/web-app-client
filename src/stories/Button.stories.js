import { Button } from './Button'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const btnStory = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
}

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
const Primary = {
  args: {
    primary: true,
    label: 'Button',
  },
}

const Secondary = {
  args: {
    label: 'Button',
  },
}

const Large = {
  args: {
    size: 'large',
    label: 'Button',
  },
}

const Small = {
  args: {
    size: 'small',
    label: 'Button',
  },
}

const Warning = {
  args: {
    primary: true,
    label: 'Delete now',
    backgroundColor: 'red',
  },
}
module.exports = {
  btnStory,
  Primary,
  Secondary,
  Warning,
  Small,
  Large,
}
