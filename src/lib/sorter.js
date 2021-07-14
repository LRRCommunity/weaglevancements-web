import map from "lodash/fp/map";
import groupBy from "lodash/fp/groupBy";

const groupByParent = groupBy(adv => adv.parent);

export function makeAdvancementTree(advancements) {
    const byParent = groupByParent(advancements);

    const treeify = map(adv => ({
        item: adv,
        children: treeify(byParent[adv.id])
    }));

    return treeify(byParent[undefined]); // love 2 index by undefined
}
