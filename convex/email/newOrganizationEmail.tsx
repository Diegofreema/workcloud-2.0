import {
  Body,
  Button,
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
const WorkcloudAdminEmailTemplate = ({ name }: Props) => {
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
              Power Your Organization Online
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
              Welcome to Workcloud – your new digital workspace to connect with
              customers, reduce operational costs, improve service delivery, and
              solve problems efficiently!
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
                  🏢 Create Your Virtual Office
                </Heading>
                <Text
                  style={{
                    fontSize: '14px',
                    color: '#000000',
                    margin: 0,
                    lineHeight: '1.5',
                  }}
                >
                  Set up your organization's profile so customers can find and
                  connect with you easily.
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
                  👥 Add Your Team
                </Heading>
                <Text
                  style={{
                    fontSize: '14px',
                    color: '#000000',
                    margin: 0,
                    lineHeight: '1.5',
                  }}
                >
                  Invite staff to manage inquiries, handle tasks, and improve
                  response time.
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
                  📈 Boost Visibility
                </Heading>
                <Text
                  style={{
                    fontSize: '14px',
                    color: '#000000',
                    margin: 0,
                    lineHeight: '1.5',
                  }}
                >
                  List your services and service points so users can reach the
                  right department faster.
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
                  ⚙️ Streamline Operations
                </Heading>
                <Text
                  style={{
                    fontSize: '14px',
                    color: '#000000',
                    margin: 0,
                    lineHeight: '1.5',
                  }}
                >
                  Use the processor workspace to let background staff support
                  frontline staff seamlessly.
                </Text>
              </Section>
            </Section>

            {/* Trial Notice */}
            <Section
              style={{
                backgroundColor: '#004282',
                borderRadius: '6px',
                padding: '20px',
                textAlign: 'center',
                margin: '30px 0',
              }}
            >
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: '16px',
                  margin: '0 0 15px 0',
                  fontWeight: '600',
                }}
              >
                🎉 Your 30-day free trial is active!
              </Text>
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  margin: 0,
                  opacity: 0.9,
                }}
              >
                Start building your online presence today
              </Text>
            </Section>

            {/* Call to Action */}

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
                Need Onboarding Support?
              </Heading>
              <Text
                style={{
                  fontSize: '14px',
                  color: '#000000',
                  margin: 0,
                  lineHeight: '1.5',
                }}
              >
                📧 Contact us at{' '}
                <Link
                  href="mailto:support@workcloud.com"
                  style={{
                    color: '#004282',
                    textDecoration: 'none',
                    fontWeight: '500',
                  }}
                >
                  support@workcloud.com
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
              Thank you for choosing Workcloud to transform how you serve your
              customers.
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

export default WorkcloudAdminEmailTemplate;
