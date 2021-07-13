function splitId(ident) {
    const [_d, path] = ident.split(":");
    const [category, id] = path.split("/");

    return { category, id };
}

// 1. Find all the root advancements
// 2. Find all the advancements parented to the root
// 3. Find all the advancements parented to those...
// 4. Etc.
//
// So each round, just keep track of the previous IDs to compare against in the next round.
//
// This function is a horrible mess. But it works.
export function chunkAdvancements(advancements) {
    const buckets = {};
    function getBucket(cat, i) {
        if (!buckets.hasOwnProperty(cat)) {
            buckets[cat] = [];
        }
        if (buckets[cat][i] == null) {
            buckets[cat][i] = [];
        }

        return buckets[cat][i];
    }

    let lastRound = {};
    for (let i = 0; true; i++) {
        let nextRound = {};

        advancements.forEach(adv => {
            const { category } = splitId(adv.id);

            if (lastRound[adv.parent] != null || (i === 0 && adv.parent == null)) {
                getBucket(category, i).push(adv);
                nextRound[adv.id] = adv;
            }
        });

        if (Object.keys(nextRound).length === 0) break;

        lastRound = nextRound;
    }

    return buckets;
}
