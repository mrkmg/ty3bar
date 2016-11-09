import BaseModule from "../lib/base-module";
import {IBlockConfig} from "../models/config-types";
import {IModuleDataFunction} from "../models/module-block";
import {cpus} from "os";

export = (dataCallback: IModuleDataFunction, config: IBlockConfig) => {
    return new CpuUsageModule(dataCallback, config);
};

class CpuUsageModule extends BaseModule {
    private lastInfo: ICpuStat = {
        idle: 0,
        total: 0,
    };

    protected onTick(): void {
        let cpu = cpus();
        let t = cpu.length;
        let idle = 0;
        let total = 0;

        for (let i = 0; i < t; i++) {
            let times = cpu[i].times;
            idle += times.idle;
            total += times.user + times.nice + times.sys + times.irq + times.idle;
        }

        let cTotal = total - this.lastInfo.total;
        let cIdle = idle - this.lastInfo.idle;
        let percentage = Math.round(((cTotal - cIdle) / cTotal) * 100);

        this.lastInfo.idle = idle;
        this.lastInfo.total = total;

        this.dataCallback({
            full_text: `${percentage}%`,
        });
    }
}

interface ICpuStat {
    idle: number;
    total: number;
}
