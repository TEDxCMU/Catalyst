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

import styles from './header.module.css';
import ExpoButton from './expo-button';
import useLoginStatus from '@lib/hooks/use-login-status';

type Props = {
  hero: any,
  expo_link: any;
}

export default function Header({ hero, expo_link } : Props) {
  const { loginStatus } = useLoginStatus();

  return (
    <div className={styles.container}>
      <h1 className={styles.hero}>{hero}</h1>
      { hero == 'Innovation Expo' ?
        (expo_link != '' ? (
          ( loginStatus == 'loggedIn' ?
            <div className={styles.btn}>
              <ExpoButton expoLink={expo_link}/>
            </div>
            :
            <div className={styles.btn}>
              <ExpoButton expoLink="/"/>
            </div>
            )
        ) : null )
      : null
      }
      
    </div>
  );
}
