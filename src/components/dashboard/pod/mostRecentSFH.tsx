import { StandardLoadingSpinner } from "~/components/shared/StandardLoadingSpinner";
import { api } from "~/utils/api";

export function MostRecentSFHPods() {
  const {
    data: podData,
    isLoading,
    isError,
  } = api.singleFamily.getMostRecent.useQuery();

  if (isLoading) return <StandardLoadingSpinner />;
  if (isError) {
    return (
      <div className="col-span-5 pl-8">
        <p>Unable to load most recent SFH pod.</p>
      </div>
    );
  }
  if (podData.length === 0) {
    return <div className="pl-8">No SFH pod history</div>;
  }

  console.log(podData);

  return (
    <>
      <div className="px-8">
        {podData?.map((pod) => {
          return (
            <div
              key={pod.id}
              className="pod-container mx-12 my-6 flex justify-center rounded-xl border-2 border-primary100 bg-primary200 p-4 text-white shadow-lg"
            >
              <MostRecentSFHPods key={pod.id} {...pod} />
            </div>
          );
        })}
      </div>
    </>
  );
}
