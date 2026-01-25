import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Section,
  Text,
} from '@react-email/components';
import React from 'react';

type Props = {
  orgName: string;
  imageUrl?: string;
  description?: string;
  address?: string;
  email: string;
};

const NewOrganizationCreatedEmail = ({
  orgName,
  imageUrl,
  description,
  address,
  email,
}: Props) => {
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
              New Organization Created
            </Heading>
            <Text
              style={{
                color: '#ffffff',
                fontSize: '16px',
                margin: 0,
                opacity: 0.9,
              }}
            >
              Workcloud Platform Update
            </Text>
          </Section>

          {/* Main Content */}
          <Section
            style={{
              padding: '40px 20px',
            }}
          >
            <Text
              style={{
                fontSize: '16px',
                color: '#000000',
                margin: '0 0 20px 0',
              }}
            >
              A new organization has been successfully created on Workcloud.
            </Text>

            {/* Organization Details Card */}
            <Section
              style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                padding: '20px',
                marginBottom: '30px',
                textAlign: 'center',
              }}
            >
              {imageUrl && (
                <Img
                  src={imageUrl}
                  alt={orgName}
                  width="80"
                  height="80"
                  style={{
                    borderRadius: '50%',
                    margin: '0 auto 15px auto',
                    objectFit: 'cover',
                  }}
                />
              )}
              <Heading
                as="h2"
                style={{
                  fontSize: '20px',
                  color: '#004282',
                  margin: '0 0 10px 0',
                  fontWeight: '600',
                }}
              >
                {orgName}
              </Heading>

              {description && (
                <Text
                  style={{
                    fontSize: '14px',
                    color: '#555555',
                    margin: '0 0 15px 0',
                    lineHeight: '1.5',
                  }}
                >
                  {description}
                </Text>
              )}
              <Text
                style={{
                  fontSize: '14px',
                  color: '#333333',
                  margin: 0,
                  fontWeight: '500',
                }}
              >
                {email}
              </Text>
              {address && (
                <Text
                  style={{
                    fontSize: '14px',
                    color: '#333333',
                    margin: 0,
                    fontWeight: '500',
                  }}
                >
                  📍 {address}
                </Text>
              )}
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
                Need Help?
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

export default NewOrganizationCreatedEmail;
