import ReactPDF, { Document, Page, Text } from "@react-pdf/renderer";

const MyDocument = () => (
  <Document>
    <Page>
      <Text>Dub</Text>
    </Page>
  </Document>
);

export const generatePDF = async () => {
  const readStream = await ReactPDF.renderToStream(<MyDocument />);
  return readStream;
};

export { renderToBuffer, renderToStream } from "@react-pdf/renderer";
