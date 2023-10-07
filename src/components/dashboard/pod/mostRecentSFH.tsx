import { SFHPodCard } from "~/components/calculators/history/PodCard";
import { StandardLoadingSpinner } from "~/components/shared/StandardLoadingSpinner";
import { api } from "~/utils/api";

export function MostRecentSFHPods() {
  const {
    data: podData,
    isLoading,
    isError,
  } = api.singleFamily.getMostRecent.useQuery();

  console.log(podData);

  if (isLoading) return <StandardLoadingSpinner />;
  else if (isError) {
    return (
      <div className="col-span-5 pl-8">
        <p>Unable to load most recent SFH pod.</p>
      </div>
    );
  } else if (podData.length === 0) {
    return <div className="pl-8">No SFH pod history</div>;
  } else
    return (
      <div className="grid gap-4 px-8 md:grid-cols-2">
        {podData?.map((pod) => {
          return <SFHPodCard key={pod.id} {...pod} />;
        })}
      </div>
    );
}
