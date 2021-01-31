import Layout from '@components/layout';
import ConfContainer from '@components/conf-container';
import SignInForm from '@components/sign-in-form';
import useLoginStatus from '@lib/hooks/use-login-status';
import SignOutButton from '@components/sign-out-button';
import Page from '@components/page';


export default function SignInPage() {
    const { loginStatus } = useLoginStatus();
    const meta = {
        title: 'Sign in - TEDxCMU Catalyst',
        description: "Sign in to enter"
      };

  return (
    <Page meta={meta} fullViewport>
      <Layout>
        <ConfContainer>
            <>
              {loginStatus !== 'loggedIn' ? (
                  <>
                    <SignInForm />
                  </>
              ) : (
                <>
                    <h2>Sign out to sign into another account</h2>
                    <SignOutButton />
                </>
              )
              }
            </>
        </ConfContainer>
      </Layout>
    </Page>
  );
}