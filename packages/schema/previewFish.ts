const COUNTRY = "Belarus";

export async function fetchFishByCountry(country: string) {
  const url = `https://fishbase.ropensci.org/species?Country=${encodeURIComponent(country)}&limit=1000`;
  const res = await fetch(url);
  const json = await res.json();
  return json.data || [];
}

async function previewFish() {
  const fishList = await fetchFishByCountry(COUNTRY);

  console.log(`Found ${fishList.length} fish for ${COUNTRY}`);
  fishList.slice(0, 10).forEach((fish: any, i: number) => {
    console.log(
      `${i + 1}. ${fish.FBname || fish.Genus + " " + fish.Species} (${fish.Genus} ${fish.Species})`
    );
  });
}

previewFish().catch(console.error);
