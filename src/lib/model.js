import m from "mithril";
import {makeAdvancementTree} from "./sorter";
import keyBy from "lodash/fp/keyBy";

const keyById = keyBy(adv => adv.id);

export const Model = {
    advancements: [],
    advancementTree: [],
    progress: {},
    _advancementById: {},
};

export const Controller = {
    loadAdvancements() {
        return m.request({
            method: "GET",
            url: "https://weaglevancements.offbeatwit.ch/api/advancements",
            responseType: "json",
        }).then((res) => {
            Model.advancements = res.advancements;
            Model.advancementTree = makeAdvancementTree(res.advancements);
            Model._advancementById = keyById(res.advancements);
            return res.advancements;
        }).catch((err) => {
            console.error(err);
        });
    },

    loadProgress() {
        return m.request({
            method: "GET",
            url: "https://weaglevancements.offbeatwit.ch/api/progress",
            responseType: "json",
        }).then((res) => {
            Model.progress = res.progress;
            return res.progress;
        }).catch((err) => {
            console.error(err);
        });
    },

    isLoaded() {
        return Model.advancements.length > 0 && Object.keys(Model.progress).length > 0;
    },

    getAdvancementById(id) {
        return Model._advancementById[id];
    },

    getProgress(advancement) {
        return Model.progress[advancement.id];
    },

    findRoot(advancement) {
        if (advancement.parent) {
            return this.findRoot(this.getAdvancementById(advancement.parent));
        } else {
            return advancement;
        }
    },

    getTotalPercentage() {
        let done = 0;
        let total = 0;

        for (let k in Model.progress) {
            const tup = Model.progress[k];

            done += tup.percentage;
            total++;
        }

        return (done / total) * 100;
    }
};
