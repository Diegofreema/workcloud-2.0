import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '~/components/Ui/themed-text';
import { ThemedView } from '~/components/Ui/themed-view';

interface CardProps {
  style?: any;
  children: React.ReactNode;
}

const Card = ({ style, children }: CardProps) => {
  return <ThemedView style={[styles.card, style]}>{children}</ThemedView>;
};

interface CardHeaderProps {
  style?: any;
  children: React.ReactNode;
}

const CardHeader = ({ style, children }: CardHeaderProps) => {
  return <ThemedView style={[styles.header, style]}>{children}</ThemedView>;
};

interface CardFooterProps {
  style?: any;
  children: React.ReactNode;
}

const CardFooter = ({ style, children }: CardFooterProps) => {
  return <ThemedView style={[styles.footer, style]}>{children}</ThemedView>;
};

interface CardTitleProps {
  style?: any;
  children: React.ReactNode;
}

const CardTitle = ({ style, children }: CardTitleProps) => {
  return <ThemedText style={[styles.title, style]}>{children}</ThemedText>;
};

interface CardDescriptionProps {
  style?: any;
  children: React.ReactNode;
}

const CardDescription = ({ style, children }: CardDescriptionProps) => {
  return (
    <ThemedText style={[styles.description, style]}>{children}</ThemedText>
  );
};

Card.Header = CardHeader;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Description = CardDescription;

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    // Shadow for iOS
    boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.8)',
  },
  header: {
    marginBottom: 12,
  },
  footer: {
    marginTop: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default Card;
