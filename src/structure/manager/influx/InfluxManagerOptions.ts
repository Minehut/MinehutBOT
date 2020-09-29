import { Listener } from "discord-akairo";

export interface InfluxManagerOptions<T> {
    clearInterval: number;
    addCondition?: boolean;
    executingQuantity: number;
    executingListener: Listener;
    executingFunction: (store: T[]) => void;
    afterExecutionFunction?: (store: T[]) => void;
}