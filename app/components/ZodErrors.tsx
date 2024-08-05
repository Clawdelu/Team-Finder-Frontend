import { Text } from "@mantine/core";
const styles = {
  color: "#ec4899", // echivalent pentru text-pink-500
  fontSize: "0.75rem", // echivalent pentru text-xs
  fontStyle: "italic", // echivalent pentru italic
  marginTop: "0.25rem", // echivalent pentru mt-1
  paddingTop: "0.5rem", // echivalent pentru py-2 (padding-y include atât top cât și bottom)
  paddingBottom: "0.5rem",
};
export function ZodErrors({ error }: { error: string[] }) {
  if (!error) return null;
  return error.map((err: string, index: number) => (
    <div key={index}>
      <Text style={styles}>{err}</Text>
    </div>
  ));
}
