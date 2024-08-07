'use client';

import type { BoxProps } from '@mui/material/Box';

import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import NoSsr from '@mui/material/NoSsr';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = BoxProps & {
  href?: string;
  disableLink?: boolean;
};

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ width = 40, height = 40, disableLink = false, className, href = '/', sx, ...other }, ref) => {
    const theme = useTheme();

    // const gradientId = useId();

    // const PRIMARY_LIGHT = theme.vars.palette.primary.light;

    // const PRIMARY_MAIN = theme.vars.palette.primary.main;

    // const PRIMARY_DARK = theme.vars.palette.primary.dark;

    /*
     * OR using local (public folder)
     * const logo = ( <Box alt="logo" component="img" src={`${CONFIG.site.basePath}/logo/logo-single.svg`} width={width} height={height} /> );
     */

    const logo = (
      <svg viewBox="0 0 371 371" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M78.7671 303.793C78.9325 302.706 79.3874 301.657 80.1495 300.759C82.3386 298.173 86.2097 297.858 88.7906 300.046C109.912 317.937 135.618 329.608 163.128 333.792C235.321 344.771 304.608 302.595 327.876 233.511C328.955 230.303 332.438 228.574 335.645 229.658C338.852 230.737 340.582 234.215 339.497 237.427C327.466 273.151 303.067 303.78 270.795 323.67C238.146 343.793 199.251 351.693 161.284 345.919C131.526 341.394 103.717 328.771 80.862 309.406C79.1797 307.974 78.4572 305.831 78.7671 303.793Z"
          fill="url(#paint0_linear_216_3830)"
        />
        <path
          d="M85.0106 278.125C85.2018 276.869 85.7861 275.654 86.7611 274.69C89.1678 272.31 93.0512 272.333 95.4366 274.741C114.749 294.285 139.357 306.81 166.607 310.954C217.24 318.654 267.249 295.413 294.014 251.74C295.786 248.853 299.562 247.944 302.449 249.716C305.337 251.487 306.24 255.262 304.474 258.151C275.121 306.041 220.281 331.524 164.763 323.081C134.886 318.537 107.895 304.805 86.7103 283.366C85.2945 281.934 84.7291 279.977 85.0106 278.125Z"
          fill="url(#paint1_linear_216_3830)"
        />
        <path
          d="M92.9818 254.696C93.2039 253.236 93.947 251.854 95.1879 250.855C97.8232 248.725 101.683 249.132 103.814 251.762C120.371 272.208 143.82 285.651 169.853 289.61C218.855 297.062 267.015 268.836 284.368 222.493C285.558 219.32 289.092 217.714 292.26 218.897C295.434 220.086 297.034 223.619 295.857 226.789C286.538 251.688 268.747 272.917 245.769 286.581C222.472 300.433 194.857 305.814 168.009 301.731C138.948 297.312 112.765 282.306 94.2823 259.476C93.1505 258.082 92.7321 256.338 92.9818 254.696Z"
          fill="url(#paint2_linear_216_3830)"
        />
        <path
          d="M166.08 273.626C166.589 270.28 169.714 267.975 173.066 268.485C218.869 275.45 261.795 243.857 268.761 198.054C269.705 191.848 269.961 185.556 269.519 179.36C269.278 175.987 271.822 173.049 275.201 172.81C278.58 172.57 281.512 175.113 281.751 178.492C282.258 185.596 281.968 192.798 280.888 199.904C272.906 252.388 223.71 288.6 171.226 280.619C167.87 280.102 165.57 276.978 166.08 273.626Z"
          fill="url(#paint3_linear_216_3830)"
        />
        <path
          d="M169.344 252.165C169.853 248.819 172.978 246.513 176.33 247.023C210.294 252.189 242.132 228.756 247.297 194.792C247.806 191.446 250.931 189.14 254.283 189.65C257.629 190.159 259.934 193.284 259.425 196.636C253.242 237.287 215.143 265.328 174.492 259.146C171.134 258.641 168.834 255.516 169.344 252.165Z"
          fill="url(#paint4_linear_216_3830)"
        />
        <path
          d="M147.033 217.143C147.223 215.897 147.8 214.693 148.762 213.733C151.159 211.341 155.041 211.34 157.433 213.737C163.486 219.796 171.184 223.683 179.683 224.976C201.486 228.292 221.922 213.251 225.238 191.448C225.746 188.102 228.872 185.796 232.223 186.306C235.575 186.816 237.875 189.94 237.365 193.292C233.032 221.782 206.328 241.436 177.838 237.103C166.73 235.414 156.676 230.334 148.758 222.41C147.326 220.97 146.75 219.006 147.033 217.143Z"
          fill="url(#paint5_linear_216_3830)"
        />
        <path
          d="M25.2043 161.018C34.2726 101.389 75.3137 51.9856 132.305 32.0834C135.504 30.9654 139.001 32.6557 140.114 35.8487C141.232 39.0483 139.542 42.5449 136.349 43.6581C83.6582 62.0595 45.7155 107.734 37.3317 162.862C32.0088 197.863 39.2579 233.727 57.7479 263.857C59.5215 266.745 58.6176 270.518 55.7296 272.291C52.8416 274.065 49.069 273.161 47.2954 270.273C27.292 237.677 19.4466 198.878 25.2043 161.018Z"
          fill="url(#paint6_linear_216_3830)"
        />
        <path
          d="M48.0378 164.49C56.8513 106.537 101.403 60.0254 158.901 48.7502C162.227 48.0975 165.448 50.2672 166.102 53.5873C166.749 56.9122 164.585 60.134 161.265 60.7876C108.836 71.067 68.2085 113.483 60.1708 166.335C55.17 199.219 63.0677 232.227 82.4141 259.278C84.3873 262.035 83.7469 265.865 80.9916 267.832C78.2363 269.8 74.4054 269.165 72.4378 266.41C51.2182 236.745 42.5539 200.55 48.0378 164.49Z"
          fill="url(#paint7_linear_216_3830)"
        />
        <path
          d="M69.3887 167.735C77.8087 112.369 124.46 70.377 180.322 67.878C183.705 67.7263 186.573 70.3464 186.719 73.7283C186.871 77.1112 184.251 79.9798 180.869 80.1258C130.84 82.3592 89.054 119.977 81.5114 169.573C78.4099 189.967 81.2949 210.61 89.8566 229.273C91.2713 232.35 89.9174 235.996 86.8416 237.405C83.7648 238.82 80.1243 237.467 78.7096 234.39C69.1526 213.548 65.9274 190.496 69.3887 167.735Z"
          fill="url(#paint8_linear_216_3830)"
        />
        <path
          d="M90.5064 170.948C95.6098 137.391 118.367 108.686 149.898 96.0276C153.038 94.7673 156.613 96.2899 157.872 99.4357C159.132 102.576 157.61 106.15 154.464 107.409C126.943 118.459 107.081 143.51 102.628 172.792C98.8328 197.749 106.348 222.839 123.242 241.633C125.507 244.15 125.299 248.028 122.783 250.293C120.266 252.557 116.388 252.35 114.123 249.833C94.7658 228.301 86.1574 199.546 90.5064 170.948Z"
          fill="url(#paint9_linear_216_3830)"
        />
        <path
          d="M111.97 174.212C116.558 144.047 138.698 119.968 168.37 112.872C171.664 112.087 174.975 114.12 175.761 117.408C176.546 120.702 174.52 124.008 171.225 124.799C146.429 130.725 127.932 150.845 124.099 176.051C121.136 195.533 127.338 214.816 141.113 228.948C143.478 231.375 143.427 235.254 141.005 237.62C138.577 239.985 134.698 239.934 132.333 237.512C115.846 220.604 108.425 197.527 111.97 174.212Z"
          fill="url(#paint10_linear_216_3830)"
        />
        <path
          d="M134.022 177.567C136.51 161.21 146.752 146.844 161.415 139.14C164.412 137.562 168.124 138.717 169.695 141.714C171.272 144.717 170.118 148.422 167.121 149.994C155.896 155.892 148.055 166.888 146.15 179.411C145.641 182.758 142.516 185.063 139.164 184.553C135.812 184.043 133.514 180.913 134.022 177.567Z"
          fill="url(#paint11_linear_216_3830)"
        />
        <path
          d="M166.064 28.8479C166.48 26.1133 168.72 23.9167 171.602 23.6658C184.363 22.5652 197.32 22.9892 210.105 24.9334C298.597 38.3912 359.643 121.335 346.184 209.833C345.675 213.179 342.55 215.484 339.198 214.974C335.847 214.465 333.547 211.34 334.057 207.989C346.498 126.182 290.067 49.5018 208.255 37.0599C196.433 35.2621 184.45 34.8648 172.652 35.8857C169.277 36.1776 166.309 33.6757 166.017 30.3005C165.971 29.8068 165.993 29.3178 166.064 28.8479Z"
          fill="url(#paint12_linear_216_3830)"
        />
        <path
          d="M177.507 51.3821C177.95 48.4719 180.44 46.2266 183.477 46.1787C191.176 46.0635 198.961 46.5987 206.632 47.7654C282.539 59.3092 334.9 130.453 323.356 206.36C323.031 208.5 322.65 210.66 322.23 212.775C321.569 216.097 318.339 218.253 315.017 217.586C311.694 216.924 309.535 213.671 310.205 210.372C310.592 208.438 310.938 206.469 311.236 204.51C321.763 135.29 274.015 70.4149 204.795 59.888C197.797 58.8238 190.688 58.3336 183.669 58.4419C180.283 58.4948 177.497 55.7888 177.445 52.398C177.428 52.0536 177.457 51.7104 177.507 51.3821Z"
          fill="url(#paint13_linear_216_3830)"
        />
        <path
          d="M196.399 74.261C196.908 70.9149 200.033 68.6097 203.385 69.1194C232.82 73.5959 259.227 88.8843 277.749 112.173C296.169 135.335 305.159 164.287 303.055 193.701C302.827 197.066 299.878 199.618 296.503 199.377C293.128 199.136 290.585 196.201 290.826 192.826C294.715 138.462 255.497 89.4524 201.546 81.2477C198.189 80.7371 195.89 77.607 196.399 74.261Z"
          fill="url(#paint14_linear_216_3830)"
        />
        <path
          d="M188.333 94.7689C188.82 91.57 191.735 89.2735 194.994 89.5953C196.712 89.7638 198.457 89.9829 200.172 90.2438C233.214 95.2687 260.861 116.608 274.13 147.323C275.475 150.435 274.041 154.04 270.934 155.387C267.827 156.733 264.216 155.298 262.87 152.191C251.289 125.382 227.163 106.756 198.328 102.371C196.828 102.143 195.304 101.952 193.797 101.804C190.424 101.476 187.961 98.4718 188.294 95.1047C188.306 94.9849 188.317 94.8765 188.333 94.7689Z"
          fill="url(#paint15_linear_216_3830)"
        />
        <path
          d="M188.983 116.703C189.487 113.391 192.558 111.095 195.883 111.554C196.224 111.6 196.563 111.652 196.909 111.704C226.423 116.193 250.357 137.761 257.885 166.652C258.736 169.927 256.773 173.278 253.497 174.135C250.222 174.987 246.871 173.024 246.014 169.748C239.722 145.609 219.726 127.588 195.064 123.837C194.775 123.793 194.492 123.75 194.202 123.712C190.849 123.248 188.505 120.152 188.968 116.799C188.974 116.759 188.979 116.731 188.983 116.703Z"
          fill="url(#paint16_linear_216_3830)"
        />
        <path
          d="M186.569 138.895C187.078 135.549 190.203 133.243 193.555 133.753C208.757 136.065 222.109 144.902 230.191 158C231.971 160.883 231.072 164.662 228.189 166.437C225.306 168.217 221.527 167.318 219.752 164.436C213.568 154.406 203.347 147.644 191.712 145.875C188.359 145.371 186.06 142.246 186.569 138.895Z"
          fill="url(#paint17_linear_216_3830)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_216_3830"
            x1="103.121"
            y1="342.659"
            x2="326.478"
            y2="251.105"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FBB92F" stopOpacity="0" />
            <stop offset="1" stopColor="#F9BB17" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_216_3830"
            x1="110.196"
            y1="305.36"
            x2="274.442"
            y2="274.166"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FBCE68" stopOpacity="0" />
            <stop offset="1" stopColor="#FBD263" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_216_3830"
            x1="117.352"
            y1="283.685"
            x2="271.268"
            y2="247.452"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FBB92F" stopOpacity="0" />
            <stop offset="1" stopColor="white" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_216_3830"
            x1="178.403"
            y1="281.953"
            x2="267.675"
            y2="210.23"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FBB92F" stopOpacity="0" />
            <stop offset="1" stopColor="#F9BB17" />
          </linearGradient>
          <linearGradient
            id="paint4_linear_216_3830"
            x1="199.498"
            y1="249.743"
            x2="238.305"
            y2="204.327"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FBCE68" stopOpacity="0" />
            <stop offset="1" stopColor="#FBD263" />
          </linearGradient>
          <linearGradient
            id="paint5_linear_216_3830"
            x1="161.544"
            y1="229.329"
            x2="241.713"
            y2="199.218"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FBB92F" stopOpacity="0" />
            <stop offset="1" stopColor="white" />
          </linearGradient>
          <linearGradient
            id="paint6_linear_216_3830"
            x1="113.179"
            y1="68.5067"
            x2="13.2726"
            y2="260.319"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FBCE68" stopOpacity="0" />
            <stop offset="1" stopColor="#FBD263" />
          </linearGradient>
          <linearGradient
            id="paint7_linear_216_3830"
            x1="131.181"
            y1="69.317"
            x2="51.4593"
            y2="237.847"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FBB92F" stopOpacity="0" />
            <stop offset="1" stopColor="white" />
          </linearGradient>
          <linearGradient
            id="paint8_linear_216_3830"
            x1="152.486"
            y1="78.0563"
            x2="81.0311"
            y2="189.52"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FBB92F" stopOpacity="0" />
            <stop offset="1" stopColor="#F9BB17" />
          </linearGradient>
          <linearGradient
            id="paint9_linear_216_3830"
            x1="126.329"
            y1="117.766"
            x2="113.867"
            y2="236.191"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FBCE68" stopOpacity="0" />
            <stop offset="1" stopColor="#FBD263" />
          </linearGradient>
          <linearGradient
            id="paint10_linear_216_3830"
            x1="146.74"
            y1="133.618"
            x2="123.418"
            y2="241.376"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FBB92F" stopOpacity="0" />
            <stop offset="1" stopColor="white" />
          </linearGradient>
          <linearGradient
            id="paint11_linear_216_3830"
            x1="154.92"
            y1="152.057"
            x2="139.159"
            y2="200.978"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FBB92F" stopOpacity="0" />
            <stop offset="1" stopColor="#F9BB17" />
          </linearGradient>
          <linearGradient
            id="paint12_linear_216_3830"
            x1="356.844"
            y1="176.335"
            x2="180.674"
            y2="19.1678"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FBB92F" stopOpacity="0" />
            <stop offset="1" stopColor="white" />
          </linearGradient>
          <linearGradient
            id="paint13_linear_216_3830"
            x1="320.932"
            y1="172.961"
            x2="195.94"
            y2="55.4775"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FBB92F" stopOpacity="0" />
            <stop offset="1" stopColor="#F9BB17" />
          </linearGradient>
          <linearGradient
            id="paint14_linear_216_3830"
            x1="301.126"
            y1="169.818"
            x2="211.162"
            y2="81.9329"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FBCE68" stopOpacity="0" />
            <stop offset="1" stopColor="#FBD263" />
          </linearGradient>
          <linearGradient
            id="paint15_linear_216_3830"
            x1="267.089"
            y1="136.438"
            x2="199.402"
            y2="104.993"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FBB92F" stopOpacity="0" />
            <stop offset="1" stopColor="white" />
          </linearGradient>
          <linearGradient
            id="paint16_linear_216_3830"
            x1="246.749"
            y1="154.152"
            x2="201.636"
            y2="124.753"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FBB92F" stopOpacity="0" />
            <stop offset="1" stopColor="#F9BB17" />
          </linearGradient>
          <linearGradient
            id="paint17_linear_216_3830"
            x1="226.359"
            y1="157.173"
            x2="191.827"
            y2="142.559"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FBCE68" stopOpacity="0" />
            <stop offset="1" stopColor="#FBD263" />
          </linearGradient>
        </defs>
      </svg>
    );

    return (
      <NoSsr
        fallback={
          <Box
            width={width}
            height={height}
            className={logoClasses.root.concat(className ? ` ${className}` : '')}
            sx={{ flexShrink: 0, display: 'inline-flex', verticalAlign: 'middle', ...sx }}
          />
        }
      >
        <Box
          ref={ref}
          component={RouterLink}
          href={href}
          width={width}
          height={height}
          className={logoClasses.root.concat(className ? ` ${className}` : '')}
          aria-label="logo"
          sx={{
            flexShrink: 0,
            display: 'inline-flex',
            verticalAlign: 'middle',
            ...(disableLink && { pointerEvents: 'none' }),
            ...sx,
          }}
          {...other}
        >
          {logo}
        </Box>
      </NoSsr>
    );
  }
);
