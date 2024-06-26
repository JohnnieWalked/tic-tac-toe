'use client';

import { motion } from 'framer-motion';
import { ComponentProps } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

/* components */
import Link from 'next/link';
import StatusBar from './StatusBar';

/* styles */
import './Header.css';

export default function Header() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: 'easeInOut', duration: 0.7 }}
      className=" bg-background text-primary container"
    >
      <ul className="items-center">
        <li>
          <div className="logo w-60 h-20 p-4 mx-7 flex items-center justify-center">
            <motion.svg
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 394 90"
            >
              <motion.path
                fill={'hsl(var(--primary))'}
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 1 }}
                transition={{
                  pathLength: { delay: 0.6, duration: 2 },
                  fillOpacity: { delay: 0.6, duration: 4 },
                  ease: 'easeInOut',
                }}
                strokeDasharray="0 1"
                d="M186.085 6.73132H172.167V35.2473H165.851V6.73132H151.909V0.416016H186.085V6.73132Z"
              />
              <motion.path
                fill={'hsl(var(--primary))'}
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 1 }}
                transition={{
                  delay: 0.6,
                  pathLength: { delay: 0.6, duration: 2 },
                  fillOpacity: { delay: 0.6, duration: 4 },
                  ease: 'easeInOut',
                }}
                strokeDasharray="0 1"
                d="M197.088 35.2473H190.772V0.416016H197.088V35.2473Z"
              />
              <motion.path
                fill={'hsl(var(--primary))'}
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 1 }}
                transition={{
                  delay: 0.6,
                  pathLength: { delay: 0.6, duration: 2 },
                  fillOpacity: { delay: 0.6, duration: 4 },
                  ease: 'easeInOut',
                }}
                strokeDasharray="0 1"
                d="M235.66 35.2473H212.876C212.293 35.2473 211.666 35.1785 210.994 35.0408C210.322 34.9032 209.658 34.6886 209.002 34.3972C208.346 34.1057 207.719 33.7292 207.12 33.2677C206.521 32.8062 205.99 32.2475 205.529 31.5917C205.067 30.9359 204.699 30.1748 204.424 29.3085C204.148 28.4422 204.011 27.4665 204.011 26.3816V9.28171C204.011 8.69876 204.08 8.07129 204.217 7.39928C204.355 6.72727 204.569 6.06335 204.861 5.40753C205.152 4.75171 205.533 4.12423 206.002 3.52509C206.472 2.92595 207.035 2.39561 207.691 1.93411C208.346 1.47261 209.103 1.10421 209.962 0.828934C210.82 0.553654 211.792 0.416016 212.876 0.416016H235.66V6.73131H212.876C212.051 6.73131 211.419 6.94992 210.982 7.38713C210.545 7.82434 210.326 8.47208 210.326 9.33031V26.3816C210.326 27.1913 210.549 27.8188 210.994 28.2641C211.439 28.7094 212.067 28.932 212.876 28.932H235.66L235.66 35.2473Z"
              />
              <motion.path
                fill={'hsl(var(--primary))'}
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 1 }}
                transition={{
                  delay: 0.6,
                  pathLength: { delay: 0.6, duration: 2 },
                  fillOpacity: { delay: 0.6, duration: 4 },
                  ease: 'easeInOut',
                }}
                strokeDasharray="0 1"
                d="M186.085 60.5819H172.167V89.0979H165.851V60.5819H151.909V54.2666H186.085V60.5819Z"
              />
              <motion.path
                fill={'hsl(var(--primary))'}
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 1 }}
                transition={{
                  delay: 0.6,
                  pathLength: { delay: 0.6, duration: 2 },
                  fillOpacity: { delay: 0.6, duration: 4 },
                  ease: 'easeInOut',
                }}
                strokeDasharray="0 1"
                d="M223.685 89.0979H217.37V80.548H195.169V89.0979H188.854V71.6823C188.854 69.1399 189.291 66.8 190.165 64.6626C191.04 62.5251 192.254 60.6871 193.809 59.1488C195.363 57.6105 197.201 56.4122 199.322 55.554C201.444 54.6957 203.759 54.2666 206.269 54.2666H220.503C220.94 54.2666 221.353 54.3476 221.742 54.5095C222.13 54.6714 222.47 54.8981 222.762 55.1896C223.053 55.4811 223.28 55.8211 223.442 56.2098C223.604 56.5984 223.685 57.0113 223.685 57.4485V89.0979ZM195.169 74.2327H217.37V60.5819H206.269C206.075 60.5819 205.666 60.6102 205.043 60.6669C204.419 60.7236 203.699 60.8653 202.881 61.092C202.063 61.3187 201.201 61.6668 200.294 62.1364C199.387 62.606 198.553 63.2538 197.792 64.0796C197.031 64.9055 196.404 65.9378 195.91 67.1765C195.416 68.4153 195.169 69.9172 195.169 71.6823V74.2327Z"
              />
              <motion.path
                fill={'hsl(var(--primary))'}
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 1 }}
                transition={{
                  delay: 0.6,
                  pathLength: { delay: 0.6, duration: 2 },
                  fillOpacity: { delay: 0.6, duration: 4 },
                  ease: 'easeInOut',
                }}
                strokeDasharray="0 1"
                d="M262.208 89.0979H239.424C238.841 89.0979 238.214 89.0291 237.542 88.8914C236.87 88.7538 236.206 88.5392 235.55 88.2478C234.894 87.9563 234.267 87.5798 233.668 87.1183C233.069 86.6568 232.538 86.0981 232.077 85.4423C231.615 84.7865 231.247 84.0254 230.971 83.1591C230.696 82.2927 230.559 81.3171 230.559 80.2322V63.1323C230.559 62.5493 230.627 61.9219 230.765 61.2498C230.903 60.5778 231.117 59.9139 231.409 59.2581C231.7 58.6023 232.081 57.9748 232.55 57.3757C233.02 56.7765 233.583 56.2462 234.238 55.7847C234.894 55.3232 235.651 54.9548 236.51 54.6795C237.368 54.4042 238.339 54.2666 239.424 54.2666H262.208V60.5819H239.424C238.598 60.5819 237.967 60.8005 237.53 61.2377C237.092 61.6749 236.874 62.3226 236.874 63.1809V80.2322C236.874 81.0418 237.097 81.6693 237.542 82.1146C237.987 82.5599 238.615 82.7826 239.424 82.7826H262.208L262.208 89.0979Z"
              />
              <motion.path
                fill={'hsl(var(--primary))'}
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 1 }}
                transition={{
                  delay: 0.6,
                  pathLength: { delay: 0.6, duration: 2 },
                  fillOpacity: { delay: 0.6, duration: 4 },
                  ease: 'easeInOut',
                }}
                strokeDasharray="0 1"
                d="M315.305 60.5819H301.387V89.0979H295.072V60.5819H281.13V54.2666H315.305L315.305 60.5819Z"
              />
              <motion.path
                fill={'hsl(var(--primary))'}
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 1 }}
                transition={{
                  delay: 0.6,
                  pathLength: { delay: 0.6, duration: 2 },
                  fillOpacity: { delay: 0.6, duration: 4 },
                  ease: 'easeInOut',
                }}
                strokeDasharray="0 1"
                d="M356.015 75.0094C356.015 77.1307 355.651 79.082 354.922 80.8632C354.193 82.6444 353.181 84.1828 351.886 85.4782C350.59 86.7737 349.056 87.7817 347.283 88.5023C345.51 89.2229 343.579 89.5832 341.49 89.5832H332.94C330.851 89.5832 328.916 89.2229 327.135 88.5023C325.354 87.7817 323.815 86.7737 322.52 85.4782C321.224 84.1828 320.208 82.6444 319.471 80.8632C318.735 79.082 318.366 77.1307 318.366 75.0094V68.354C318.366 66.2489 318.735 64.3017 319.471 62.5124C320.208 60.7231 321.224 59.1847 322.52 57.8974C323.815 56.61 325.354 55.602 327.135 54.8733C328.916 54.1446 330.851 53.7803 332.94 53.7803H341.49C343.579 53.7803 345.51 54.1446 347.283 54.8733C349.056 55.602 350.59 56.61 351.886 57.8974C353.181 59.1847 354.193 60.7231 354.922 62.5124C355.651 64.3017 356.015 66.2489 356.015 68.354V75.0094ZM349.7 68.354C349.7 67.1072 349.501 65.9777 349.105 64.9656C348.708 63.9536 348.149 63.0872 347.429 62.3666C346.708 61.646 345.842 61.0874 344.83 60.6907C343.818 60.2939 342.704 60.0956 341.49 60.0956H332.94C331.709 60.0956 330.588 60.2939 329.576 60.6907C328.564 61.0874 327.693 61.646 326.965 62.3666C326.236 63.0872 325.673 63.9536 325.277 64.9656C324.88 65.9777 324.682 67.1072 324.682 68.354V75.0094C324.682 76.2563 324.88 77.3857 325.277 78.3978C325.673 79.4099 326.236 80.2762 326.965 80.9968C327.693 81.7174 328.564 82.276 329.576 82.6727C330.588 83.0695 331.709 83.2679 332.94 83.2679H341.441C342.672 83.2679 343.793 83.0695 344.805 82.6727C345.818 82.276 346.688 81.7174 347.417 80.9968C348.145 80.2762 348.708 79.4099 349.105 78.3978C349.501 77.3857 349.7 76.2563 349.7 75.0094V68.354Z"
              />
              <motion.path
                fill={'hsl(var(--primary))'}
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 1 }}
                transition={{
                  delay: 0.6,
                  pathLength: { delay: 0.6, duration: 2 },
                  fillOpacity: { delay: 0.6, duration: 4 },
                  ease: 'easeInOut',
                }}
                strokeDasharray="0 1"
                d="M390.895 74.8642H370.953V68.5003H390.895V74.8642ZM393.736 89.0979H370.953C370.078 89.0979 369.123 88.9441 368.087 88.6364C367.05 88.3287 366.091 87.8227 365.208 87.1183C364.326 86.4139 363.589 85.499 362.998 84.3736C362.407 83.2481 362.111 81.8677 362.111 80.2322V57.4485C362.111 57.0113 362.192 56.5984 362.354 56.2098C362.516 55.8211 362.739 55.4811 363.022 55.1896C363.306 54.8981 363.642 54.6714 364.03 54.5095C364.419 54.3476 364.84 54.2666 365.293 54.2666H393.736V60.5819H368.427V80.2322C368.427 81.058 368.645 81.6896 369.082 82.1268C369.52 82.564 370.159 82.7826 371.001 82.7826H393.736V89.0979Z"
              />
              <motion.path
                fill={'hsl(var(--primary))'}
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 1 }}
                transition={{
                  delay: 0.6,
                  pathLength: { delay: 0.6, duration: 2 },
                  fillOpacity: { delay: 0.6, duration: 4 },
                  ease: 'easeInOut',
                }}
                strokeDasharray="0 1"
                d="M45.1078 1.14452C25.275 3.74555 9.34364 10.4649 3.81645 15.8837C0.998671 18.5931 -0.518603 21.4109 0.673537 24.7706C1.97406 28.8889 4.68346 30.4061 16.8216 33.8741C22.7823 35.6082 27.6592 38.2092 27.6592 39.8349C21.0483 50.7809 11.2944 70.0718 9.56038 85.5696C9.34363 87.1953 9.77713 87.8455 10.7525 88.7125C12.4865 90.3382 12.92 89.688 13.4619 86.7618C16.1713 71.0472 31.2356 43.1945 42.5068 32.2485C47.167 27.8051 51.8271 24.7706 54.103 24.7706C54.7533 24.7706 55.1868 24.9873 55.6203 25.7459C56.9208 28.1302 58.113 25.5292 56.9208 22.4946C56.2706 20.4355 53.9947 19.2434 52.0439 19.2434C47.167 19.3517 34.1618 30.081 29.7184 37.0171C26.7922 29.6475 10.1023 26.1795 3.92482 23.4701C13.1368 13.4994 45.1078 5.58797 63.5318 5.58797C83.1479 5.47959 105.799 9.81464 114.469 15.1251C116.203 16.3172 116.745 12.7408 115.336 11.7654C101.247 1.7948 64.0737 -1.13138 45.1078 1.14452Z"
              />
              <motion.path
                fill={'hsl(var(--primary))'}
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 1 }}
                transition={{
                  delay: 0.6,
                  pathLength: { delay: 0.6, duration: 2 },
                  fillOpacity: { delay: 0.6, duration: 4 },
                  ease: 'easeInOut',
                }}
                strokeDasharray="0 1"
                d="M130.447 89.5835V0.416016H132.646V89.5835H130.447Z"
              />
            </motion.svg>
          </div>
        </li>
        <li>
          <NavLink href={'/'}> Home</NavLink>
        </li>
        <li>
          <NavLink href={'/guide'}>How to play</NavLink>
        </li>
        <li>
          <NavLink href={'/new-game'}>New Game</NavLink>
        </li>
        <li className="ml-auto mr-7">
          <div className=" ">
            <ThemeToggle />
          </div>
        </li>
      </ul>
      <StatusBar className=" text-lg flex justify-between items-center pt-10 " />
    </motion.nav>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, 'className'>) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        'opacity-60',
        pathname === props.href && 'opacity-100 active'
      )}
    />
  );
}
