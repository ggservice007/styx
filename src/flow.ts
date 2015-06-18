namespace Styx {
    export interface ControlFlowGraph {
        entry: FlowNode;
        functions: FlowFunction[]; 
    }

    export interface FlowFunction {
        entry: FlowNode;
    }
    
    export interface FlowEdge {
        source: FlowNode;
        target: FlowNode;
        type: EdgeType;
        label: string;
        data: ESTree.Expression;
    }

    export class FlowNode {
        id: number;
        incomingEdges: FlowEdge[];
        outgoingEdges: FlowEdge[];

        constructor(id: number) {
            this.id = id;
            this.incomingEdges = [];
            this.outgoingEdges = [];
        }

        appendTo(node: FlowNode, label: string, edgeType = EdgeType.Normal, edgeData: ESTree.Expression = null): FlowNode {
            let edge: FlowEdge = {
                source: node,
                target: this,
                type: edgeType,
                label: label,
                data: edgeData
            };
            
            node.outgoingEdges.push(edge);
            this.incomingEdges.push(edge);

            return this;
        }
        
        appendConditionallyTo(node: FlowNode, label: string, condition: ESTree.Expression): FlowNode {
            return this.appendTo(node, label, EdgeType.Conditional, condition);
        }
        
        appendEpsilonEdgeTo(node: FlowNode): FlowNode {
            return this.appendTo(node, "", EdgeType.Epsilon);
        }
    }
    
    export const enum EdgeType {
        Normal = 0,
        Epsilon = 1,
        Conditional = 2,
        AbruptCompletion = 3
    }
}
