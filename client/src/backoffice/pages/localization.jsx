import { LocalizationView } from "../sections/localization";
import { Helmet } from "react-helmet-async";

export default function LocalizationPage() {
  return (
    <>
      <Helmet>
        <title> Localization | GreenVille </title>
      </Helmet>

      <LocalizationView />
    </>
  );
}
