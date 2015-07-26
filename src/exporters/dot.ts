export { exportDot };

import {
    ControlFlowGraph,
    EdgeType,
    FlowEdge,
    FlowNode,
    FlowProgram,
    NodeType
} from "../flow";

import { partition } from "../util/ArrayUtil";

function exportDot(flowProgram: FlowProgram, functionId = 0): string {
    const flowGraph = findFlowGraphForId(flowProgram, functionId);

    return computeDotLines(flowGraph).join("\n");
}

function computeDotLines(flowGraph: ControlFlowGraph): string[] {
    let entryAndExitNodeList = flowGraph.nodes
        .filter(isExitNode)
        .map(node => node.id)
        .join(" ");

    let [conditionalEdges, unconditionalEdges] = partition(flowGraph.edges,
        edge => edge.type === EdgeType.Conditional);

    return [
        "digraph control_flow_graph {",
        `    node [shape = doublecircle] ${entryAndExitNodeList}`,
        "    node [shape = circle]",
        "",
        "    // Unconditional edges",
        ...unconditionalEdges.map(formatEdge).map(indent),
        "",
        "    // Conditional edges",
        "    edge [color = orange, fontcolor = orange]",
        ...conditionalEdges.map(formatEdge).map(indent),
        "}"
    ];
}

function isExitNode(node: FlowNode): boolean {
    return node.type === NodeType.ErrorExit
        || node.type === NodeType.SuccessExit;
}

function indent(line: string): string {
    return "    " + line;
}

function formatEdge(edge: FlowEdge): string {
    const from = edge.source.id;
    const to = edge.target.id;
    const attributes = edge.label ? ` [label = " ${edge.label}"]` : "";

    return `${from} -> ${to}${attributes}`;
}

function findFlowGraphForId(flowProgram: FlowProgram, functionId: number): ControlFlowGraph {
    if (!functionId) {
        return flowProgram.flowGraph;
    }

    for (let fun of flowProgram.functions) {
        if (fun.id === functionId) {
            return fun.flowGraph;
        }
    }

    throw Error(`Couldn't find function with id ${functionId}`);
}