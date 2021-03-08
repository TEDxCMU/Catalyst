/**
 * Copyright 2020 Vercel Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Link from 'next/link';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { SkipNavContent } from '@reach/skip-nav';
import { NAVIGATION, CONF_TITLE } from '@lib/constants';
import styles from './layout.module.css';
import MobileMenu from './mobile-menu';
import Footer from './footer';
import useLoginStatus from '@lib/hooks/use-login-status';
import { signOut } from '@lib/user-api';

type Props = {
  children: React.ReactNode;
  className?: string;
  hideNav?: boolean;
  layoutStyles?: any;
};

export default function Layout({ children, className, hideNav, layoutStyles }: Props) {
  const router = useRouter();
  const activeRoute = router.asPath;
  const { loginStatus } = useLoginStatus();

  const handleLogout = async () => {
    await signOut();
    router.reload();
  };

  return (
    <>
      <div className={styles.background}>
        {!hideNav && (
          <header className={cn(styles.header)}>
            <MobileMenu key={router.asPath} />
            <Link href="/">
              <a className={styles.logo}>
                <img src="/logo.png" alt="TEDxCMU Logo" />
              </a>
            </Link>
            <div className={styles.tabs}>
              {NAVIGATION.map(({ name, route }) => (
                <Link key={name} href={route}>
                  <a className={cn(styles.tab, { [styles.active]: activeRoute === route})}>
                    {name}
                  </a>
                </Link>
              ))}
            </div>
            {loginStatus === 'loggedIn' ? (
              <button className={styles.btn} onClick={handleLogout}>
                Log Out
              </button>
            ) : (
              <div />
            )}
          </header>
        )}
        <div className={styles.page}>
          <main className={styles.main} style={layoutStyles}>
            <SkipNavContent />
            <div className={cn(styles.full, className)}>{children}</div>
          </main>
          {!activeRoute.startsWith('/stage') && activeRoute !== '/' && <Footer />}
        </div>
      </div>
    </>
  );
}
