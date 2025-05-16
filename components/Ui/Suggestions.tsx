import { Suggestion } from '~/components/Ui/Suggestion';
import VStack from '~/components/Ui/VStack';
import { SuggestionTypes } from '~/constants/types';

type Props = {
  suggestions: SuggestionTypes[] | undefined;
};
export const Suggestions = ({ suggestions }: Props) => {
  if (!suggestions || !suggestions.length) return null;
  return (
    <VStack gap={5}>
      {suggestions?.map((suggestion) => (
        <Suggestion key={suggestion._id} suggestion={suggestion} />
      ))}
    </VStack>
  );
};
