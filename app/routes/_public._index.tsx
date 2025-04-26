import {
  Accordion,
  Art,
  Base,
  Box,
  Button,
  Carousel,
  Divider,
  Input,
  List,
  Loading,
  Skeleton,
  Text,
  Touchable,
  Vimeo,
  Tag,
  Color,
} from '@aic-kits/react';
import { AirplaneInFlight, Check, Heart, House, Star, X, type IconWeight } from '@phosphor-icons/react';
import type { MetaFunction } from '@remix-run/node';
import { useState, useEffect } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'AIC Kits Components Demo' },
    {
      name: 'description',
      content: 'Demonstration of AIC Kits React components',
    },
  ];
};

// Helper component for color swatches
const ColorSwatch = ({ color, name }: { color: Color; name: string }) => (
  <Box mb="md" width={90}>
    <Box
      bgColor={color}
      width={90}
      height={60}
      r="sm"
      b="hairline"
      borderColor="grey300"
      mb="xs"
    />
    <Text fontSize="xs" fontWeight="medium" textAlign="center">
      {name}
    </Text>
  </Box>
);

// Helper component for color section
const ColorSection = ({
  title,
  colors,
}: {
  title: string;
  colors: Color[]
}) => (
  <Box mb="xl">
    <Box mb="md">
      <Text fontSize="large" fontWeight="semibold">
        {title}
      </Text>
    </Box>
    <Box
      display="flex"
      flexWrap="wrap"
      gap="sm"
      justifyContent="flex-start"
    >
      {colors.map((item) => (
        <ColorSwatch key={item} color={item} name={item} />
      ))}
    </Box>
  </Box>
);

// Define types for Carousel data
interface CarouselTextItem {
  id: string;
  text: string;
  bgColor: Color;
}

interface LogoItem {
  id: string;
  src: string;
}

const CarouselItem = ({
  item,
  isFocused,
  focusAnimation,
}: {
  item: CarouselTextItem;
  isFocused: boolean;
  focusAnimation: boolean;
}) => (
  <Box
    position="relative"
    height={200}
    bgColor={item.bgColor}
    r="xl"
    display="flex"
    justifyContent="center"
    alignItems="center"
    transform={focusAnimation ? isFocused ? 'scale(1)' : 'scale(0.8)' : undefined}
    opacity={focusAnimation ? isFocused ? 1 : 0.7 : undefined}
    transition="transform 0.5s ease, opacity 0.5s ease"
    filter={focusAnimation ? isFocused ? 'none' : 'grayscale(50%)' : undefined}
  >
    <Text fontSize="2xl" color="white" fontWeight={focusAnimation ? isFocused ? 'bold' : 'regular' : 'bold'}>
      {item.text}
    </Text>
  </Box>
);

const iconWeights: IconWeight[] = [
  'thin',
  'light',
  'regular',
  'bold',
  'fill',
  'duotone',
];

export default function ComponentDemo() {
  // Base colors
  const baseColors: Color[] = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
  ];

  // Grey scale
  const greyColors: Color[] = [
    'grey100',
    'grey200',
    'grey300',
    'grey400',
    'grey500',
    'grey600',
    'grey700',
    'grey800',
    'grey900',
  ];

  // Orange colors
  const orangeColors: Color[] = [
    'orange100',
    'orange200',
    'orange300',
    'orange400',
    'orange500',
    'orange600',
    'orange700',
    'orange800',
    'orange900',
  ];

  // Cyan colors
  const cyanColors: Color[] = [
    'cyan100',
    'cyan200',
    'cyan300',
    'cyan400',
    'cyan500',
    'cyan600',
    'cyan700',
    'cyan800',
    'cyan900',
  ];

  // Purple colors
  const purpleColors: Color[] = [
    'purple100',
    'purple200',
    'purple300',
    'purple400',
    'purple500',
    'purple600',
    'purple700',
    'purple800',
    'purple900',
  ];

  // Teal colors
  const tealColors: Color[] = [
    'teal100',
    'teal200',
    'teal300',
    'teal400',
    'teal500',
    'teal600',
    'teal700',
    'teal800',
    'teal900',
  ];

  // Lime colors
  const limeColors: Color[] = [
    'lime100',
    'lime200',
    'lime300',
    'lime400',
    'lime500',
    'lime600',
    'lime700',
    'lime800',
    'lime900',
  ];

  // Pink colors
  const pinkColors: Color[] = [
    'pink100',
    'pink200',
    'pink300',
    'pink400',
    'pink500',
    'pink600',
    'pink700',
    'pink800',
    'pink900',
  ];

  const [isPressed, setIsPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  // Toggle loading state every few seconds for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading(prev => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Sample data for List component
  const listItems = [
    { id: '1', title: 'List Item 1', description: 'Description for item 1' },
    { id: '2', title: 'List Item 2', description: 'Description for item 2' },
    { id: '3', title: 'List Item 3', description: 'Description for item 3' },
  ];

  // Sample data for Carousel with types
  const carouselTextItems: CarouselTextItem[] = [
    { id: 'c1', text: 'Slide 1', bgColor: 'cyan500' },
    { id: 'c2', text: 'Slide 2', bgColor: 'purple500' },
    { id: 'c3', text: 'Slide 3', bgColor: 'teal500' },
    { id: 'c4', text: 'Slide 4', bgColor: 'orange500' },
  ];

  const longCarouselTextItems: CarouselTextItem[] = [
    { id: 'c1', text: 'Slide 1', bgColor: 'cyan500' },
    { id: 'c2', text: 'Slide 2', bgColor: 'purple500' },
    { id: 'c3', text: 'Slide 3', bgColor: 'teal500' },
    { id: 'c4', text: 'Slide 4', bgColor: 'orange500' },
    { id: 'c5', text: 'Slide 5', bgColor: 'cyan500' },
    { id: 'c6', text: 'Slide 6', bgColor: 'purple500' },
    { id: 'c7', text: 'Slide 7', bgColor: 'teal500' },
    { id: 'c8', text: 'Slide 8', bgColor: 'orange500' },
    { id: 'c9', text: 'Slide 9', bgColor: 'cyan500' },
    { id: 'c10', text: 'Slide 10', bgColor: 'purple500' },
  ];

  const logoItems: LogoItem[] = [
    { id: 'logo1', src: 'https://via.placeholder.com/100x50/EEEEEE/9E9E9E?text=Logo1' },
    { id: 'logo2', src: 'https://via.placeholder.com/100x50/EEEEEE/9E9E9E?text=Logo2' },
    { id: 'logo3', src: 'https://via.placeholder.com/100x50/EEEEEE/9E9E9E?text=Logo3' },
    { id: 'logo4', src: 'https://via.placeholder.com/100x50/EEEEEE/9E9E9E?text=Logo4' },
    { id: 'logo5', src: 'https://via.placeholder.com/100x50/EEEEEE/9E9E9E?text=Logo5' },
    { id: 'logo6', src: 'https://via.placeholder.com/100x50/EEEEEE/9E9E9E?text=Logo6' },
    { id: 'logo7', src: 'https://via.placeholder.com/100x50/EEEEEE/9E9E9E?text=Logo7' },
  ];

  return (
    <>
      <Base p="xl">
        <Box mb="xl">
          <Text fontSize="3xl" fontWeight="bold">
            AIC Kits React Components
          </Text>
        </Box>

        {/* Color Palette Section */}
        <Box
          p="lg"
          r="md"
          bgColor="white"
          mb="lg"
          b="thin"
          borderColor="grey300"
          display="flex"
          flexDirection="column"
          gap="md"
        >
          <Text fontSize="xl" fontWeight="semibold">
            Color Palette
          </Text>
          <Box mb="lg">
            <Text>
              Explore the complete color palette available in the theme:
            </Text>
          </Box>

          <ColorSection title="Base Colors" colors={baseColors} />
          <ColorSection title="Grey Scale" colors={greyColors} />
          <ColorSection title="Orange" colors={orangeColors} />
          <ColorSection title="Cyan" colors={cyanColors} />
          <ColorSection title="Purple" colors={purpleColors} />
          <ColorSection title="Teal" colors={tealColors} />
          <ColorSection title="Lime" colors={limeColors} />
          <ColorSection title="Pink" colors={pinkColors} />
        </Box>

        <Box
          p="lg"
          r="md"
          bgColor="white"
          mb="lg"
          b="thin"
          borderColor="grey300"
          display="flex"
          flexDirection="column"
          gap="md"
        >
          <Text fontSize="xl" fontWeight="semibold">
            Box Component
          </Text>
          <Text>
            The Box component is a foundational layout component that supports
            various style props:
          </Text>

          <Box display="flex" flexWrap="wrap" gap="md">
            <Box
              p="md"
              bgColor="primary"
              r="sm"
              width={150}
              height={100}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Text color="white" fontWeight="bold">Primary</Text>
            </Box>

            <Box
              p="md"
              bgColor="secondary"
              r="sm"
              width={150}
              height={100}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Text color="white" fontWeight="bold">Secondary</Text>
            </Box>

            <Box
              p="md"
              bgColor="success"
              r="sm"
              width={150}
              height={100}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Text color="white" fontWeight="bold">Success</Text>
            </Box>

            <Box
              p="md"
              bgColor="danger"
              r="sm"
              width={150}
              height={100}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Text color="white" fontWeight="bold">Danger</Text>
            </Box>
          </Box>
        </Box>

        <Box
          p="lg"
          r="md"
          bgColor="white"
          mb="lg"
          b="thin"
          borderColor="grey300"
          display="flex"
          flexDirection="column"
          gap="md"
        >
          <Text fontSize="xl" fontWeight="semibold">
            Text Component
          </Text>
          <Text>
            The Text component supports various typography options:
          </Text>

          <Box display="flex" flexDirection="column" gap="sm">
            <Text fontSize="3xl" fontWeight="bold">Heading 1</Text>
            <Text fontSize="2xl" fontWeight="semibold">Heading 2</Text>
            <Text fontSize="xl" fontWeight="medium">Heading 3</Text>
            <Text fontSize="large">Large Text</Text>
            <Text fontSize="medium">Medium Text</Text>
            <Text fontSize="small" color="grey600">Small Text</Text>
            <Text fontSize="xs" color="grey500">Extra Small Text</Text>

            <Text fontSize="medium" fontWeight="bold" color="primary">
              Colored Text
            </Text>

            <Text textAlign="center">
              Center Aligned Text
            </Text>

            <Text textTransform="uppercase">
              Uppercase Text
            </Text>

            <Text useRichText>
              Rich Text with <strong>bold formatting</strong> support
            </Text>
          </Box>
        </Box>

        {/* Button Component Section */}
        <Box
          p="lg"
          r="md"
          bgColor="white"
          mb="lg"
          b="thin"
          borderColor="grey300"
          display="flex"
          flexDirection="column"
          gap="md"
        >
          <Text fontSize="xl" fontWeight="semibold">
          Button Component
          </Text>
          <Text>
          The Button component now uses Touchable internally for better
          interaction feedback:
          </Text>

          <Box display="flex" flexDirection="row" alignItems="center" flexWrap="wrap" gap="md">
            <Button
              text="Primary Button"
              color="primary"
              onClick={() => alert('Clicked Primary Button')}
            />
            <Button
              text="Secondary Button"
              color="secondary"
              onClick={() => alert('Clicked Secondary Button')}
            />
            <Button
              text="Disabled Button"
              color="primary"
              disabled
              onClick={() => alert('Should not trigger')}
            />
            <Button
              text="Loading Button"
              color="primary"
              loading
              onClick={() => alert('Should not trigger')}
            />
            <Button
              text="With Icon"
              color="success"
              icon={Check}
              onClick={() => alert('Clicked Icon Button')}
            />
            <Button
              text="With Right Icon"
              color="cyan500"
              rightIcon={Check}
              onClick={() => alert('Clicked Icon Button')}
            />
            <Button
              text="Rounded"
              color="info"
              corner="rounded"
              onClick={() => alert('Clicked Rounded Button')}
            />
            <Button
              text="Square"
              color="warning"
              corner="square"
              onClick={() => alert('Clicked Square Button')}
            />
            <Button
              text="Outlined Primary"
              variant="outlined"
              color="primary"
              onClick={() => alert('Clicked Outlined Primary')}
            />
            <Button
              text="Outlined Secondary"
              variant="outlined"
              color="secondary"
              onClick={() => alert('Clicked Outlined Secondary')}
            />
            <Button
              text="Text Danger"
              variant="text"
              color="danger"
              onClick={() => alert('Clicked Text Danger')}
            />
            <Button
              text="Text Disabled"
              variant="text"
              color="primary"
              disabled
              onClick={() => alert('Should not trigger')}
            />
          </Box>

          {/* New Size Examples */}
          <Box mt="lg" gap="md">
            <Text fontSize="large" fontWeight="medium">
            Button Sizes
            </Text>
            <Box display="flex" flexDirection="row" alignItems="center" flexWrap="wrap" gap="md">
              <Button
                text="Small Button"
                size="sm"
                color="primary"
                onClick={() => alert('Clicked Small Primary')}
              />
              <Button
                text="Medium Button (Default)"
                size="md"
                color="primary"
                onClick={() => alert('Clicked Medium Primary')}
              />
              <Button
                text="Large Button"
                size="lg"
                color="primary"
                onClick={() => alert('Clicked Large Primary')}
              />
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center" flexWrap="wrap" gap="md" mt="md">
              <Button
                text="Small Outlined"
                size="sm"
                variant="outlined"
                color="secondary"
                onClick={() => alert('Clicked Small Outlined')}
              />
              <Button
                text="Medium Text"
                size="md"
                variant="text"
                color="danger"
                onClick={() => alert('Clicked Medium Text')}
              />
              <Button
                text="Large with Icon"
                size="lg"
                color="success"
                icon={Check}
                onClick={() => alert('Clicked Large Icon')}
              />
            </Box>
          </Box>
        </Box>

        {/* Touchable Component Section */}
        <Box
          p="lg"
          r="md"
          bgColor="white"
          mb="lg"
          b="thin"
          borderColor="grey300"
          display="flex"
          flexDirection="column"
          gap="md"
        >
          <Text fontSize="xl" fontWeight="semibold">
          Touchable Component
          </Text>
          <Text>
          The Touchable component provides interaction feedback:
          </Text>

          <Box display="flex" flexDirection="row" flexWrap="wrap" gap="md">
            <Touchable
              onClick={() => alert('Clicked!')}
              style={{
                padding: '12px 24px',
                backgroundColor: 'var(--primary-color)',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <Text color="white">Click Me</Text>
            </Touchable>

            <Touchable
              onClick={() => setIsPressed(!isPressed)}
              style={{
                padding: '12px 24px',
                backgroundColor: isPressed ? 'var(--success-color)' : 'var(--secondary-color)',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              <Text color="white">Toggle Me {isPressed ? 'ON' : 'OFF'}</Text>
            </Touchable>
          </Box>
        </Box>

        {/* Art Component Section */}
        <Box
          p="lg"
          r="md"
          bgColor="white"
          mb="lg"
          b="thin"
          borderColor="grey300"
          display="flex"
          flexDirection="column"
          gap="md"
        >
          <Text fontSize="xl" fontWeight="semibold">
          Art Component
          </Text>
          <Text>
          The Art component can display different types of visual elements:
          </Text>

          <Box display="flex" flexDirection="row" flexWrap="wrap" gap="lg" alignItems="center" mb="lg">
            <Box display="flex" flexDirection="column" alignItems="center">
              <Art type="emoji" art="😊" size="md" />
              <Box mt="xs">
                <Text fontSize="small">Emoji</Text>
              </Box>
            </Box>

            <Box display="flex" flexDirection="column" alignItems="center">
              <Art
                type="svg"
                art={`
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              `}
                width="md"
                height="md"
                style={{ color: 'var(--success-color)' }}
              />
              <Box mt="xs">
                <Text fontSize="small">SVG</Text>
              </Box>
            </Box>

            <Box display="flex" flexDirection="column" alignItems="center">
              <Art
                type="image"
                art="https://via.placeholder.com/40"
                width="md"
                height="md"
              />
              <Box mt="xs">
                <Text fontSize="small">Image</Text>
              </Box>
            </Box>

            <Box display="flex" flexDirection="column" alignItems="center">
              <Art
                type="brand"
                art="AIC"
                width="md"
                height="md"
              />
              <Box mt="xs">
                <Text fontSize="small">Brand</Text>
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* New IconArt Examples with Weights */}
          <Box mt="md" display="flex" flexDirection="column" gap="md">
            <Text fontSize="large" fontWeight="medium">
            Icon Art (Phosphor Icons)
            </Text>
            <Text>
            Demonstrating various icons with different weights:
            </Text>

            <Box display="flex" flexDirection="column" gap="lg">
              {/* Example: House Icon */}
              <Box display="flex" flexDirection="column" gap="sm">
                <Text fontWeight="semibold">{'Icon: \'house\''} </Text>
                <Box display="flex" flexDirection="row" flexWrap="wrap" gap="md">
                  {iconWeights.map((weight) => (
                    <Box key={`house-${weight}`} display="flex" flexDirection="column" alignItems="center" width={60}>
                      <Art type="icon" art={House} size="md" weight={weight} color="primary" />
                      <Box mt="xxs">
                        <Text fontSize="2xs" color="grey600">{weight}</Text>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Example: Heart Icon */}
              <Box display="flex" flexDirection="column" gap="sm">
                <Text fontWeight="semibold">{'Icon: \'heart\''}</Text>
                <Box display="flex" flexDirection="row" flexWrap="wrap" gap="md">
                  {iconWeights.map((weight) => (
                    <Box key={`heart-${weight}`} display="flex" flexDirection="column" alignItems="center" width={60}>
                      <Art type="icon" art={Heart} size="md" weight={weight} color="danger" />
                      <Box mt="xxs">
                        <Text fontSize="2xs" color="grey600">{weight}</Text>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Example: Airplane Icon */}
              <Box display="flex" flexDirection="column" gap="sm">
                <Text fontWeight="semibold">{'Icon: \'airplane-in-flight\''} </Text>
                <Box display="flex" flexDirection="row" flexWrap="wrap" gap="md">
                  {iconWeights.map((weight) => (
                    <Box key={`airplane-${weight}`} display="flex" flexDirection="column" alignItems="center" width={60}>
                      <Art type="icon" art={AirplaneInFlight} size="md" weight={weight} color="info" />
                      <Box mt="xxs">
                        <Text fontSize="2xs" color="grey600">{weight}</Text>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Example: Star Icon */}
              <Box display="flex" flexDirection="column" gap="sm">
                <Text fontWeight="semibold">{'Icon: \'star\''} </Text>
                <Box display="flex" flexDirection="row" flexWrap="wrap" gap="md">
                  {iconWeights.map((weight) => (
                    <Box key={`star-${weight}`} display="flex" flexDirection="column" alignItems="center" width={60}>
                      <Art type="icon" art={Star} size="md" weight={weight} color="secondary" />
                      <Box mt="xxs">
                        <Text fontSize="2xs" color="grey600">{weight}</Text>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Base Component Section */}
        <Box
          p="lg"
          r="md"
          bgColor="white"
          mb="lg"
          b="thin"
          borderColor="grey300"
          display="flex"
          flexDirection="column"
          gap="md"
        >
          <Text fontSize="xl" fontWeight="semibold">
          Base Component
          </Text>
          <Box mb="md">
            <Text>
            The Base component provides a layout with header:
            </Text>
          </Box>

          {/* Example 1: Default Header (Logged Out) */}
          <Box mb="lg" gap="md">
            <Text fontSize="large" fontWeight="medium">Default Header (Logged Out)</Text>
            <Box b="thin" borderColor="grey300" r="lg" height="300px" fw overflow="hidden">
              <Base
                backgroundColor="white"
                header={{
                  title: 'Header Component',
                  backgroundColor: 'white',
                  navItems: [
                    {
                      label: 'Home',
                      isActive: true,
                      onClick: () => alert('Home clicked'),
                    },
                    {
                      label: 'About',
                      onClick: () => alert('About clicked'),
                    },
                  ],
                  // Default state (logged out)
                  onSignInClick: () => alert('Sign In clicked'),
                  onRegisterClick: () => alert('Register clicked'),
                }}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  fh
                >
                  <Text fontSize="medium" color="grey600" textAlign="center">
                  Content area with default header (logged out).
                  </Text>
                </Box>
              </Base>
            </Box>
          </Box>

          {/* Example 2: Header with Profile Dropdown (Logged In) */}
          <Box gap="md">
            <Text fontSize="large" fontWeight="medium">Header with Profile (Logged In)</Text>
            <Box b="thin" borderColor="grey300" r="lg" height="300px" fw overflow="hidden">
              <Base
                backgroundColor="white"
                header={{
                  title: 'Header Component',
                  backgroundColor: 'white',
                  navItems: [
                    {
                      label: 'Dashboard',
                      isActive: true,
                      onClick: () => alert('Dashboard clicked'),
                    },
                    {
                      label: 'Settings',
                      onClick: () => alert('Settings clicked'),
                    },
                  ],
                  // Demonstrate logged-in state and dropdown
                  isSignedIn: true,
                  userProfile: {
                    name: 'Jane Doe',
                    email: 'jane.doe@example.com',
                    avatar: 'https://dummyimage.com/40x40/f5f5f5/000000.png', // Example avatar URL
                  },
                  profileDropdownItems: [
                    { label: 'My Profile', onClick: () => alert('My Profile clicked') },
                    { label: 'Account Settings', onClick: () => alert('Account Settings clicked') },
                    { label: 'Sign Out', onClick: () => alert('Sign Out clicked') },
                  ],
                  onProfileClick: () => console.log('Profile icon clicked (optional handler)'), // Optional handler
                }}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  fh
                >
                  <Text fontSize="medium" color="grey600" textAlign="center">
                  Content area with logged-in header and profile dropdown.
                  </Text>
                </Box>
              </Base>
            </Box>
          </Box>
        </Box>

        {/* Loading Component Section */}
        <Box
          p="lg"
          r="md"
          bgColor="white"
          mb="lg"
          b="thin"
          borderColor="grey300"
          display="flex"
          flexDirection="column"
          gap="md"
        >
          <Text fontSize="xl" fontWeight="semibold">
          Loading Component
          </Text>
          <Text>
          The Loading component can be used standalone or wrapped around
          content:
          </Text>

          <Box display="flex" flexDirection="row" flexWrap="wrap" gap="lg" alignItems="center">
            <Box display="flex" flexDirection="column" alignItems="center" gap="sm">
              <Text fontSize="small">Small</Text>
              <Loading size="small" loading={isLoading} color="primary" />
            </Box>

            <Box display="flex" flexDirection="column" alignItems="center" gap="sm">
              <Text fontSize="small">Medium</Text>
              <Loading size="medium" loading={isLoading} color="secondary" />
            </Box>

            <Box display="flex" flexDirection="column" alignItems="center" gap="sm">
              <Text fontSize="small">Large</Text>
              <Loading size="large" loading={isLoading} color="success" />
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="sm"
              width="200px"
            >
              <Text fontSize="small">With Content</Text>
              <Box
                p="md"
                bgColor="grey100"
                r="md"
                width="100%"
                height="100px"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Loading size="medium" loading={isLoading} color="primary">
                  <Text textAlign="center">Content is loaded!</Text>
                </Loading>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Button with Loading Section */}
        <Box
          p="lg"
          r="md"
          bgColor="white"
          mb="lg"
          b="thin"
          borderColor="grey300"
          display="flex"
          flexDirection="column"
          gap="md"
        >
          <Text fontSize="xl" fontWeight="semibold">
          Button with Loading
          </Text>
          <Text>
          Buttons can display a loading state:
          </Text>

          <Box display="flex" flexDirection="row" flexWrap="wrap" gap="md">
            <Button
              text="Loading Primary"
              color="primary"
              loading={isLoading}
            />
            <Button
              text="Loading Secondary"
              color="secondary"
              loading={isLoading}
            />
            <Button
              text="Loading with Icon"
              color="success"
              loading={isLoading}
              icon={Check}
            />
          </Box>
        </Box>

        {/* Divider Component Section */}
        <Box
          p="lg"
          r="md"
          bgColor="white"
          mb="lg"
          b="thin"
          borderColor="grey300"
          display="flex"
          flexDirection="column"
          gap="md"
        >
          <Text fontSize="xl" fontWeight="semibold">
          Divider Component
          </Text>
          <Text>
          The Divider component can be used to separate content:
          </Text>

          <Box mb="md">
            <Text>Horizontal Divider (Default)</Text>
            <Box mt="md" mb="md">
              <Divider />
            </Box>
            <Text>Content below divider</Text>
          </Box>

          <Box display="flex" flexDirection="row" height="100px" alignItems="stretch">
            <Box flex={1} display="flex" justifyContent="center" alignItems="center">
              <Text>Left Content</Text>
            </Box>
            <Divider orientation="vertical" />
            <Box flex={1} display="flex" justifyContent="center" alignItems="center">
              <Text>Right Content</Text>
            </Box>
          </Box>

          <Box mt="md">
            <Box mb="sm">
              <Text>Custom Dividers</Text>
            </Box>
            <Box mb="md">
              <Divider color="primary" thickness={2} />
            </Box>
            <Box mb="md">
              <Divider color="secondary" thickness={3} />
            </Box>
            <Divider color="danger" thickness={4} />
          </Box>
        </Box>

        {/* List Component Section */}
        <Box
          p="lg"
          r="md"
          bgColor="white"
          mb="lg"
          b="thin"
          borderColor="grey300"
          display="flex"
          flexDirection="column"
          gap="md"
        >
          <Text fontSize="xl" fontWeight="semibold">
          List Component
          </Text>
          <Text>
          The List component displays a collection of items:
          </Text>

          <Box>
            <List
              data={listItems}
              renderItem={(item, index) => (
                <Box
                  p="md"
                  bgColor={index % 2 === 0 ? 'grey100' : 'white'}
                  b="thin"
                  borderColor="grey300"
                  r="sm"
                  mb="xs"
                >
                  <Text fontWeight="semibold">{item.title}</Text>
                  <Text fontSize="small" color="grey600">{item.description}</Text>
                </Box>
              )}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={
                <Box p="sm" mb="sm" bgColor="grey200" r="sm">
                  <Text fontWeight="semibold">List Header</Text>
                </Box>
              }
              ListFooterComponent={
                <Box p="sm" mt="sm" bgColor="grey200" r="sm">
                  <Text fontWeight="semibold">List Footer</Text>
                </Box>
              }
              ItemSeparatorComponent={<Box height={8} />}
            />
          </Box>
        </Box>

        {/* Input Component Section */}
        <Box
          p="lg"
          r="md"
          bgColor="white"
          mb="lg"
          b="thin"
          borderColor="grey300"
          display="flex"
          flexDirection="column"
          gap="md"
        >
          <Text fontSize="xl" fontWeight="semibold">
          Input Component
          </Text>
          <Text>
          The Input component allows users to enter text:
          </Text>

          <Box width="100%" maxWidth="400px">
            <Box mb="md">
              <Input
                label="Default Input"
                placeholder="Type something..."
                value={inputValue}
                onChange={(value) => setInputValue(value)}
              />
            </Box>

            <Box mb="md">
              <Input
                label="Input with Icon"
                placeholder="Search..."
                leftIcon={<Box>🔍</Box>}
              />
            </Box>

            <Box mb="md">
              <Input
                label="Input with Error"
                placeholder="Enter email..."
                value={inputError}
                onChange={(value) => setInputError(value)}
                error={inputError.includes('@') ? '' : 'Please enter a valid email'}
              />
            </Box>

            <Box mb="md">
              <Input
                label="Disabled Input"
                placeholder="Cannot edit this..."
                disabled
              />
            </Box>

            <Input
              label="Input with Helper Text"
              placeholder="Enter password..."
              type="password"
              helperText="Password must be at least 8 characters"
            />
          </Box>
        </Box>

        {/* Skeleton Component Section */}
        <Box
          p="lg"
          r="md"
          bgColor="white"
          mb="lg"
          b="thin"
          borderColor="grey300"
          display="flex"
          flexDirection="column"
          gap="md"
        >
          <Text fontSize="xl" fontWeight="semibold">
          Skeleton Component
          </Text>
          <Text>
          The Skeleton component provides loading placeholders:
          </Text>

          <Box display="flex" flexDirection="row" flexWrap="wrap" gap="lg">
            <Box display="flex" flexDirection="column" alignItems="center" gap="sm">
              <Text fontSize="small">Rectangle</Text>
              <Skeleton
                variant="rectangle"
                width={150}
                height={100}
                visible={isLoading}
              >
                <Box
                  width={150}
                  height={100}
                  bgColor="primary"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text color="white">Content</Text>
                </Box>
              </Skeleton>
            </Box>

            <Box display="flex" flexDirection="column" alignItems="center" gap="sm">
              <Text fontSize="small">Rounded</Text>
              <Skeleton
                variant="rounded"
                width={150}
                height={100}
                visible={isLoading}
              >
                <Box
                  width={150}
                  height={100}
                  bgColor="secondary"
                  r="md"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text color="white">Content</Text>
                </Box>
              </Skeleton>
            </Box>

            <Box display="flex" flexDirection="column" alignItems="center" gap="sm">
              <Text fontSize="small">Circle</Text>
              <Skeleton
                variant="circle"
                width={100}
                height={100}
                visible={isLoading}
              >
                <Box
                  width={100}
                  height={100}
                  bgColor="success"
                  r="full"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text color="white">Avatar</Text>
                </Box>
              </Skeleton>
            </Box>
          </Box>

          <Box mt="md">
            <Box mb="sm">
              <Text fontSize="medium">Text Skeleton Example:</Text>
            </Box>
            <Box>
              <Box mb="sm">
                <Skeleton
                  variant="rounded"
                  height={32}
                  width="80%"
                  visible={isLoading}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                >
                  <Text>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </Text>
                </Skeleton>
              </Box>
              <Box mb="sm">
                <Skeleton
                  variant="rounded"
                  height={32}
                  width="60%"
                  visible={isLoading}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                >
                  <Text>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </Text>
                </Skeleton>
              </Box>
              <Skeleton
                variant="rounded"
                height={32}
                width="70%"
                visible={isLoading}
                display="flex"
                flexDirection="row"
                alignItems="center"
              >
                <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Text>
              </Skeleton>
            </Box>
          </Box>
        </Box>

        {/* Vimeo Component Section */}
        <Box
          p="lg"
          r="md"
          bgColor="white"
          mb="lg"
          b="thin"
          borderColor="grey300"
          display="flex"
          flexDirection="column"
          gap="md"
        >
          <Text fontSize="xl" fontWeight="semibold">
          Vimeo Component
          </Text>
          <Text>
          The Vimeo component embeds Vimeo videos:
          </Text>

          <Box>
            <Vimeo
              videoId="824804225" // Sample Vimeo video ID
              playerHeight={300} // Use playerHeight for specific iframe height
              config={{
                autoplay: false,
                loop: false,
                muted: false,
                controls: true,
              }}
              callbacks={{
                onReady: () => console.log('Video ready'),
                onPlay: () => console.log('Video playing'),
                onPlayerPause: () => console.log('Video paused'),
              }}
            />
          </Box>
        </Box>

        {/* Carousel Component Section */}
        <Box
          p="lg"
          r="md"
          bgColor="white"
          mb="lg"
          b="thin"
          borderColor="grey300"
          display="flex"
          flexDirection="column"
          gap="md"
        >
          <Text fontSize="xl" fontWeight="semibold">
          Carousel Component
          </Text>
          <Text>
          The Carousel component displays items in a scrollable view with
          various options:
          </Text>

          {/* Example 1: Basic Carousel */}
          <Box mb="lg">
            <Box mb="md">
              <Text fontSize="large" fontWeight="medium">Basic Carousel</Text>
            </Box>
            <Carousel<CarouselTextItem>
              items={carouselTextItems}
              keyExtractor={(item: CarouselTextItem) => item.id}
              renderItem={({ item }: { item: CarouselTextItem })=> (
                <CarouselItem
                  item={item}
                  isFocused={false}
                  focusAnimation={false}
                />
              )}
            />
          </Box>

          {/* Example 2: AutoPlay Carousel */}
          <Box mb="lg">
            <Box mb="md">
              <Text fontSize="large" fontWeight="medium">AutoPlay Carousel (3s delay)</Text>
            </Box>
            <Carousel<CarouselTextItem>
              items={carouselTextItems}
              keyExtractor={(item: CarouselTextItem) => item.id}
              autoPlay={{ delay: 3000 }}
              renderItem={({ item }: { item: CarouselTextItem })=> (
                <CarouselItem
                  item={item}
                  isFocused={false}
                  focusAnimation={false}
                />
              )}
            />
          </Box>

          {/* Example 3: Carousel without Navigation */}
          <Box mb="lg">
            <Box mb="md">
              <Text fontSize="large" fontWeight="medium">Carousel without Navigation</Text>
            </Box>
            <Carousel<CarouselTextItem>
              items={carouselTextItems}
              keyExtractor={(item: CarouselTextItem) => item.id}
              showNavigation={false}
              renderItem={({ item }: { item: CarouselTextItem })=> (
                <CarouselItem
                  item={item}
                  isFocused={false}
                  focusAnimation={false}
                />
              )}
            />
          </Box>

          {/* Example 4: Carousel without Pagination */}
          <Box mb="lg">
            <Box mb="md">
              <Text fontSize="large" fontWeight="medium">Carousel without Pagination</Text>
            </Box>
            <Carousel<CarouselTextItem>
              items={carouselTextItems}
              keyExtractor={(item: CarouselTextItem) => item.id}
              showPagination={false}
              renderItem={({ item }: { item: CarouselTextItem })=> (
                <CarouselItem
                  item={item}
                  isFocused={false}
                  focusAnimation={false}
                />
              )}
            />
          </Box>

          {/* Example 5: AutoScroll Carousel (Logo Strip) */}
          <Box mb="lg">
            <Box mb="md">
              <Text fontSize="large" fontWeight="medium">AutoScroll Carousel (Logo Strip)</Text>
            </Box>
            <Box bgColor="grey200" p="md">
              <Carousel<LogoItem>
                items={logoItems}
                keyExtractor={(item: LogoItem) => item.id}
                autoScroll
                renderItem={({ item }: { item: LogoItem })=> (
                  <Skeleton variant="rounded" height={100} width={200} visible>
                    <Art type="image" art={item.src} height={100} width={200} />
                  </Skeleton>
                )}
              />
            </Box>
          </Box>

          {/* Example 6: Focused Item Styling */}
          <Box mb="lg">
            <Box mb="md">
              <Text fontSize="large" fontWeight="medium">Focused Item Styling</Text>
            </Box>
            <Carousel<CarouselTextItem>
              items={carouselTextItems}
              keyExtractor={(item: CarouselTextItem) => item.id}
              itemSpacing="none"
              renderItem={({
                item,
                isFocused,
              }: {
              item: CarouselTextItem;
              isFocused: boolean;
            }) => (
                <CarouselItem
                  item={item}
                  isFocused={isFocused}
                  focusAnimation
                />
              )}
            />
          </Box>

          {/* Example 7: Multi-Item View (3 items) */}
          <Box mb="lg">
            <Box mb="md">
              <Text fontSize="large" fontWeight="medium">Multi-Item View (itemsPerView: 3)</Text>
            </Box>
            <Carousel<CarouselTextItem>
              items={longCarouselTextItems}
              keyExtractor={(item: CarouselTextItem) => item.id}
              itemsPerView={3}
              itemSpacing="sm" // Add some spacing between items
              renderItem={({
                item,
                isFocused,
              }: {
              item: CarouselTextItem;
              isFocused: boolean;
            }) => (
                <CarouselItem
                  item={item}
                  isFocused={isFocused}
                  focusAnimation={false} // Focus animation might look odd with multiple items
                />
              )}
            />
          </Box>

          {/* Example 8: Multi-Item View with Fixed Width (2 items, 250px) */}
          <Box mb="lg">
            <Box mb="md">
              <Text fontSize="large" fontWeight="medium">Multi-Item View (itemsPerView: 2, itemWidth: 250px)</Text>
            </Box>
            <Carousel<CarouselTextItem>
              items={carouselTextItems}
              keyExtractor={(item: CarouselTextItem) => item.id}
              itemsPerView={2}
              itemWidth={250} // Fixed width
              itemSpacing="sm"
              renderItem={({
                item,
                isFocused,
              }: {
              item: CarouselTextItem;
              isFocused: boolean;
            }) => (
                <CarouselItem
                  item={item}
                  isFocused={isFocused}
                  focusAnimation={false}
                />
              )}
            />
          </Box>

          {/* Example 9: Single-Item View with Fixed Width (1 item, 300px) */}
          <Box mb="lg">
            <Box mb="md">
              <Text fontSize="large" fontWeight="medium">Single-Item View (itemsPerView: 1, itemWidth: 300px)</Text>
            </Box>
            <Carousel<CarouselTextItem>
              items={carouselTextItems}
              keyExtractor={(item: CarouselTextItem) => item.id}
              itemsPerView={1} // Explicitly 1
              itemWidth={300} // Fixed width
              itemSpacing="sm"
              renderItem={({
                item,
                isFocused,
              }: {
              item: CarouselTextItem;
              isFocused: boolean;
            }) => (
                <CarouselItem
                  item={item}
                  isFocused={isFocused}
                  focusAnimation={false} // Focus animation makes sense here
                />
              )}
            />
          </Box>

        </Box>

        {/* Accordion Component Section */}
        <Box
          p="lg"
          r="md"
          bgColor="white"
          mb="lg"
          b="thin"
          borderColor="grey300"
          display="flex"
          flexDirection="column"
          gap="md"
        >
          <Text fontSize="xl" fontWeight="semibold">
          Accordion Component
          </Text>
          <Text>
          The Accordion component displays collapsible content sections:
          </Text>

          {/* Example 1: Basic Accordion */}
          <Box mb="md" display="flex" flexDirection="column" gap="sm">
            <Text fontSize="large" fontWeight="medium">Basic Accordion</Text>
            <Accordion
              renderHeader={() => <Text fontWeight="semibold">Basic Header</Text>}
              renderContent={() => (
                <Text>
                This is the content of the basic accordion. It expands and
                collapses smoothly.
                </Text>
              )}
            />
          </Box>

          {/* Example 2: Initially Expanded */}
          <Box mb="md" display="flex" flexDirection="column" gap="sm">
            <Text fontSize="large" fontWeight="medium">Initially Expanded</Text>
            <Accordion
              initialExpanded
              renderHeader={(isExpanded) => (
                <Text fontWeight="semibold">
                Initially Expanded Header (State: {isExpanded ? 'Open' : 'Closed'})
                </Text>
              )}
              renderContent={() => (
                <Text>
                This accordion starts in the expanded state.
                </Text>
              )}
            />
          </Box>

          {/* Example 3: Disabled Accordion */}
          <Box mb="md" display="flex" flexDirection="column" gap="sm">
            <Text fontSize="large" fontWeight="medium">Disabled Accordion</Text>
            <Accordion
              disabled
              renderHeader={() => <Text fontWeight="semibold">Disabled Header</Text>}
              renderContent={() => (
                <Text>
                This content is not reachable because the accordion is disabled.
                </Text>
              )}
            />
          </Box>

          {/* Example 4: Complex Header/Content */}
          <Box mb="md" display="flex" flexDirection="column" gap="sm">
            <Text fontSize="large" fontWeight="medium">Complex Header/Content</Text>
            <Accordion
              renderHeader={(isExpanded) => (
                <Box display="flex" justifyContent="space-between" alignItems="center" fw>
                  <Text fontWeight="bold" color="primary">Custom Header</Text>
                  <Box bgColor={isExpanded ? 'success' : 'grey300'} r="full" px="sm">
                    <Text fontSize="xs" color={isExpanded ? 'white' : 'grey700'}>
                      {isExpanded ? 'ACTIVE' : 'INACTIVE'}
                    </Text>
                  </Box>
                </Box>
              )}
              renderContent={() => (
                <Box display="flex" gap="md">
                  <Art type="emoji" art="🎉" size="lg" />
                  <Box flex={1}>
                    <Text fontWeight="semibold">Content Title</Text>
                    <Text fontSize="small" color="grey600">
                    This content area uses Box for layout and includes other
                    components like Art and Text with different styles.
                    </Text>
                  </Box>
                </Box>
              )}
            />
          </Box>

          {/* Example 5: Multiple Accordions */}
          <Box mb="md" display="flex" flexDirection="column" gap="sm">
            <Text fontSize="large" fontWeight="medium">Multiple Accordions</Text>
            <Box display="flex" flexDirection="column" gap="sm">
              <Accordion
                renderHeader={() => <Text fontWeight="semibold">Item 1</Text>}
                renderContent={() => <Text>Content for item 1.</Text>}
                bgColor="grey100" // Slightly different background for distinction
              />
              <Accordion
                renderHeader={() => <Text fontWeight="semibold">Item 2</Text>}
                renderContent={
                  () => (
                    <Text>
                    Content for item 2. This one might belonger to show height
                    adjustment.
                    </Text>
                  )
                }
                bgColor="grey100"
              />
              <Accordion
                initialExpanded
                renderHeader={() => <Text fontWeight="semibold">Item 3 (Initially Open)</Text>}
                renderContent={() => <Text>Content for item 3.</Text>}
                bgColor="grey100"
              />
            </Box>
          </Box>

        </Box>

        {/* Tag Component Section */}
        <Box
          p="lg"
          r="md"
          bgColor="white"
          mb="lg"
          b="thin"
          borderColor="grey300"
          display="flex"
          flexDirection="column"
          gap="md"
        >
          <Text fontSize="xl" fontWeight="semibold">
          Tag Component
          </Text>
          <Text>
          The Tag component displays concise information or keywords:
          </Text>

          {/* Variants and Colors */}
          <Box mb="md" display="flex" flexDirection="column" gap="sm">
            <Text fontSize="large" fontWeight="medium">Variants & Colors</Text>
            <Box display="flex" flexWrap="wrap" gap="sm">
              <Tag color="primary">Primary Solid</Tag>
              <Tag color="secondary">Secondary Solid</Tag>
              <Tag color="success">Success Solid</Tag>
              <Tag color="danger">Danger Solid</Tag>
              <Tag color="warning">Warning Solid</Tag>
              <Tag color="info">Info Solid</Tag>
              <Tag color="grey500">Grey Solid</Tag>
            </Box>
            <Box display="flex" flexWrap="wrap" gap="sm">
              <Tag variant="outlined" color="primary">Primary Outlined</Tag>
              <Tag variant="outlined" color="secondary">Secondary Outlined</Tag>
              <Tag variant="outlined" color="success">Success Outlined</Tag>
              <Tag variant="outlined" color="danger">Danger Outlined</Tag>
              <Tag variant="outlined" color="warning">Warning Outlined</Tag>
              <Tag variant="outlined" color="info">Info Outlined</Tag>
              <Tag variant="outlined" color="grey500">Grey Outlined</Tag>
            </Box>
          </Box>

          {/* Sizes */}
          <Box mb="md" display="flex" flexDirection="column" gap="sm">
            <Text fontSize="large" fontWeight="medium">Sizes</Text>
            <Box display="flex" flexWrap="wrap" gap="sm" alignItems="center">
              <Tag size="sm" color="primary">Small</Tag>
              <Tag size="md" color="secondary">Medium (Default)</Tag>
              <Tag size="lg" color="success">Large</Tag>
              <Tag size="sm" variant="outlined" color="danger">Small Outlined</Tag>
              <Tag size="md" variant="outlined" color="info">Medium Outlined</Tag>
              <Tag size="lg" variant="outlined" color="warning">Large Outlined</Tag>
            </Box>
          </Box>

          {/* Radius */}
          <Box mb="md" display="flex" flexDirection="column" gap="sm">
            <Text fontSize="large" fontWeight="medium">Radius</Text>
            <Box display="flex" flexWrap="wrap" gap="sm" alignItems="center">
              <Tag radius="sm" color="primary">Small Radius</Tag>
              <Tag radius="md" color="secondary">Medium Radius</Tag>
              <Tag radius="lg" color="success">Large Radius</Tag>
              <Tag radius="xl" color="info">XL Radius</Tag>
              <Tag radius="full" color="warning">Full Radius (Default)</Tag>
              <Tag radius="none" color="danger">None Radius</Tag>
            </Box>
          </Box>

          {/* With Icons */}
          <Box mb="md" display="flex" flexDirection="column" gap="sm">
            <Text fontSize="large" fontWeight="medium">With Icons</Text>
            <Box display="flex" flexWrap="wrap" gap="sm" alignItems="center">
              <Tag color="primary" icon={Star}>
              With Left Icon
              </Tag>
              <Tag color="success" rightIcon={Check}>
              With Right Icon
              </Tag>
              <Tag
                variant="outlined"
                color="danger"
                icon={Heart}
                rightIcon={X}
              >
              Left & Right Icons
              </Tag>
            </Box>
          </Box>

          {/* Custom Text Color */}
          <Box mb="md" display="flex" flexDirection="column" gap="sm">
            <Text fontSize="large" fontWeight="medium">Custom Text Color</Text>
            <Box display="flex" flexWrap="wrap" gap="sm" alignItems="center">
              <Tag color="primary" textColor="orange500">
              Primary BG, Orange Text
              </Tag>
              <Tag variant="outlined" color="secondary" textColor="purple600">
              Secondary Outline, Purple Text
              </Tag>
            </Box>
          </Box>

          {/* Inline Flow Example */}
          <Box mb="md" display="flex" flexDirection="column" gap="sm">
            <Text fontSize="large" fontWeight="medium">Inline Flow</Text>
            <Text>
            Tags can flow inline with text, like this: Here is some regular text, followed by a <Tag color="success" size="sm">Small Tag</Tag> and then another <Tag color="info" variant="outlined">Outlined Tag</Tag> within the same line.
            </Text>
          </Box>

        </Box>
      </Base>
    </>
  );
}
