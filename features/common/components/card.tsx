import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface CardProps {
  style?: any;
  children: React.ReactNode;
}

const Card = ({ style, children }: CardProps) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

interface CardHeaderProps {
  style?: any;
  children: React.ReactNode;
}

const CardHeader = ({ style, children }: CardHeaderProps) => {
  return <View style={[styles.header, style]}>{children}</View>;
};

interface CardFooterProps {
  style?: any;
  children: React.ReactNode;
}

const CardFooter = ({ style, children }: CardFooterProps) => {
  return <View style={[styles.footer, style]}>{children}</View>;
};

interface CardTitleProps {
  style?: any;
  children: React.ReactNode;
}

const CardTitle = ({ style, children }: CardTitleProps) => {
  return <Text style={[styles.title, style]}>{children}</Text>;
};

interface CardDescriptionProps {
  style?: any;
  children: React.ReactNode;
}

const CardDescription = ({ style, children }: CardDescriptionProps) => {
  return <Text style={[styles.description, style]}>{children}</Text>;
};

Card.Header = CardHeader;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Description = CardDescription;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    // Shadow for iOS
    boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.8)",
  },
  header: {
    marginBottom: 12,
  },
  footer: {
    marginTop: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});

export default Card;
