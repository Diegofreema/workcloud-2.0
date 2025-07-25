import { HelpComponent } from "~/components/HelpComponent";
import { CustomScrollView } from "~/components/Ui/CustomScrollView";

const help = () => {
  return (
    <CustomScrollView>
      <HelpComponent />
    </CustomScrollView>
  );
};

export default help;
