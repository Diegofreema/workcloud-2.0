import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Section,
  Text,
} from '@react-email/components';
import React from 'react';
type Props = {
  name: string;
};
const WelcomeEmail = ({ name }: Props) => {
  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          backgroundColor: '#ffffff',
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Section
            style={{
              backgroundColor: '#004282',
              padding: '30px 20px',
              textAlign: 'center',
            }}
          >
            <Heading
              style={{
                color: '#ffffff',
                fontSize: '28px',
                fontWeight: 'bold',
                margin: '0 0 10px 0',
                letterSpacing: '-0.5px',
              }}
            >
              Welcome to Workcloud
            </Heading>
            <Text
              style={{
                color: '#ffffff',
                fontSize: '16px',
                margin: 0,
                opacity: 0.9,
              }}
            >
              Let's Get Started!
            </Text>
          </Section>

          {/* Main Content */}
          <Section
            style={{
              padding: '40px 20px',
            }}
          >
            {/* Greeting */}
            <Text
              style={{
                fontSize: '16px',
                color: '#000000',
                margin: '0 0 20px 0',
              }}
            >
              Hi <strong>{name}</strong>,
            </Text>

            <Text
              style={{
                fontSize: '16px',
                color: '#000000',
                margin: '0 0 30px 0',
                lineHeight: '1.6',
              }}
            >
              Welcome to Workcloud – the platform that connects you to
              organizations and makes problem-solving easier!
            </Text>

            {/* Features Section */}
            <Heading
              as="h2"
              style={{
                fontSize: '20px',
                color: '#004282',
                margin: '0 0 20px 0',
                fontWeight: '600',
              }}
            >
              Here's what you can do right now:
            </Heading>

            {/* Feature Cards */}
            <Section
              style={{
                marginBottom: '30px',
              }}
            >
              {/* Feature 1 */}
              <Section
                style={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  padding: '20px',
                  marginBottom: '15px',
                }}
              >
                <Heading
                  as="h3"
                  style={{
                    fontSize: '16px',
                    color: '#004282',
                    margin: '0 0 8px 0',
                    fontWeight: '600',
                  }}
                >
                  🔍 Search & Connect
                </Heading>
                <Text
                  style={{
                    fontSize: '14px',
                    color: '#000000',
                    margin: 0,
                    lineHeight: '1.5',
                  }}
                >
                  Find banks, hospitals, schools, logistics, government and
                  other organizations in one place.
                </Text>
              </Section>

              {/* Feature 2 */}
              <Section
                style={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  padding: '20px',
                  marginBottom: '15px',
                }}
              >
                <Heading
                  as="h3"
                  style={{
                    fontSize: '16px',
                    color: '#004282',
                    margin: '0 0 8px 0',
                    fontWeight: '600',
                  }}
                >
                  📋 Stay Organized
                </Heading>
                <Text
                  style={{
                    fontSize: '14px',
                    color: '#000000',
                    margin: 0,
                    lineHeight: '1.5',
                  }}
                >
                  Access support and services without visiting physical offices.
                </Text>
              </Section>

              {/* Feature 3 */}
              <Section
                style={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  padding: '20px',
                  marginBottom: '15px',
                }}
              >
                <Heading
                  as="h3"
                  style={{
                    fontSize: '16px',
                    color: '#004282',
                    margin: '0 0 8px 0',
                    fontWeight: '600',
                  }}
                >
                  ⚡ Explore Features
                </Heading>
                <Text
                  style={{
                    fontSize: '14px',
                    color: '#000000',
                    margin: 0,
                    lineHeight: '1.5',
                  }}
                >
                  Create or join virtual organizations to manage tasks
                  efficiently.
                </Text>
              </Section>

              {/* Feature 4 */}
              <Section
                style={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  padding: '20px',
                  marginBottom: '15px',
                }}
              >
                <Heading
                  as="h3"
                  style={{
                    fontSize: '16px',
                    color: '#004282',
                    margin: '0 0 8px 0',
                    fontWeight: '600',
                  }}
                >
                  🏢 Create Your Own Organization
                </Heading>
                <Text
                  style={{
                    fontSize: '14px',
                    color: '#000000',
                    margin: 0,
                    lineHeight: '1.5',
                  }}
                >
                  Reduce operating expenses, create staff flexibility, reduce
                  overcrowded work environment, increase customer accessibility,
                  and earn.
                </Text>
              </Section>
            </Section>

            {/* Call to Action */}
            <Section
              style={{
                textAlign: 'center',
                margin: '40px 0 30px 0',
              }}
            >
              <Text
                style={{
                  fontSize: '16px',
                  color: '#000000',
                  margin: '0 0 20px 0',
                  fontWeight: '500',
                }}
              >
                Your journey to faster, smarter connections starts today!
              </Text>
            </Section>

            <Hr
              style={{
                border: 'none',
                borderTop: '1px solid #e5e5e5',
                margin: '30px 0',
              }}
            />

            {/* Support Section */}
            <Section
              style={{
                textAlign: 'center',
              }}
            >
              <Heading
                as="h3"
                style={{
                  fontSize: '16px',
                  color: '#004282',
                  margin: '0 0 15px 0',
                  fontWeight: '600',
                }}
              >
                Need Help?
              </Heading>
              <Text
                style={{
                  fontSize: '14px',
                  color: '#000000',
                  margin: '0 0 10px 0',
                  lineHeight: '1.5',
                }}
              >
                We're here for you!
              </Text>
              <Text
                style={{
                  fontSize: '14px',
                  color: '#000000',
                  margin: 0,
                  lineHeight: '1.5',
                }}
              >
                📧{' '}
                <Link
                  href="mailto:support@workcloud.com"
                  style={{
                    color: '#004282',
                    textDecoration: 'none',
                  }}
                >
                  support@workcloud.com
                </Link>
                <br />
                🌐 Visit our workspace on{' '}
                <Link
                  href="#"
                  style={{
                    color: '#004282',
                    textDecoration: 'none',
                  }}
                >
                  workcloudapp
                </Link>
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section
            style={{
              backgroundColor: '#f8f9fa',
              padding: '25px 20px',
              textAlign: 'center',
              borderTop: '1px solid #e5e5e5',
            }}
          >
            <Text
              style={{
                fontSize: '14px',
                color: '#000000',
                margin: '0 0 10px 0',
                fontWeight: '500',
              }}
            >
              Thank you for choosing Workcloud.
            </Text>
            <Text
              style={{
                fontSize: '12px',
                color: '#666666',
                margin: 0,
              }}
            >
              – The Workcloud Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;
