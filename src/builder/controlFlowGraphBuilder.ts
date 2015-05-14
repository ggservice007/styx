/// <reference path="../estree.ts"/>
/// <reference path="../types.ts"/>
/// <reference path="../util/idGenerator.ts"/>

module Styx.ControlFlowGraphBuilder {
    interface ConstructionContext {
        createNode: () => FlowNode;
    }
    
    export function constructGraphFor(program: ESTree.Program): ControlFlowGraph {
        let idGenerator = Util.createIdGenerator();
        let constructionContext = {
            createNode: () => new FlowNode(idGenerator.makeNew())
        };
        
        return parseProgram(program, constructionContext);
    }

    function parseProgram(program: ESTree.Program, context: ConstructionContext): ControlFlowGraph {
        let entryNode = context.createNode();
        let flowGraph = new ControlFlowGraph(entryNode);

        parseStatements(program.body, flowGraph.entry, context);

        return flowGraph;
    }

    function parseStatements(statements: ESTree.Statement[], currentFlowNode: FlowNode, context: ConstructionContext): FlowNode {
        for (let statement of statements) {
            currentFlowNode = parseStatement(statement, currentFlowNode, context);
        }
        
        return currentFlowNode;
    }

    function parseStatement(statement: ESTree.Statement, currentFlowNode: FlowNode, context: ConstructionContext): FlowNode {
        if (statement.type === ESTree.NodeType.EmptyStatement) {
            currentFlowNode = context.createNode().appendTo(currentFlowNode);
        } else if (statement.type === ESTree.NodeType.BlockStatement) {
            let blockStatement = <ESTree.BlockStatement>statement;
            currentFlowNode = parseStatements(blockStatement.body, currentFlowNode, context);
        } else if (statement.type === ESTree.NodeType.VariableDeclaration) {
            let declaration = <ESTree.VariableDeclaration>statement;
            currentFlowNode = parseVariableDeclaration(declaration, currentFlowNode, context);
        } else if (statement.type === ESTree.NodeType.IfStatement) {
            let ifStatement = <ESTree.IfStatement>statement;
            currentFlowNode = parseIfStatement(ifStatement, currentFlowNode, context);
        } else if (statement.type === ESTree.NodeType.WhileStatement) {
            let whileStatement = <ESTree.WhileStatement>statement;
            currentFlowNode = parseWhileStatement(whileStatement, currentFlowNode, context);
        } else if (statement.type === ESTree.NodeType.DoWhileStatement) {
            let doWhileStatement = <ESTree.DoWhileStatement>statement;
            currentFlowNode = parseDoWhileStatement(doWhileStatement, currentFlowNode, context);
        } else {
            throw Error(`Encountered unsupported statement type '${statement.type}'`);
        }

        return currentFlowNode;
    }

    function parseVariableDeclaration(declaration: ESTree.VariableDeclaration, currentFlowNode: FlowNode, context: ConstructionContext): FlowNode {
        for (let declarator of declaration.declarations) {
            currentFlowNode = context.createNode().appendTo(currentFlowNode);
        }

        return currentFlowNode;
    }

    function parseIfStatement(ifStatement: ESTree.IfStatement, currentFlowNode: FlowNode, context: ConstructionContext): FlowNode {
        return ifStatement.alternate === null
            ? parseSimpleIfStatement(ifStatement, currentFlowNode, context)
            : parseIfElseStatement(ifStatement, currentFlowNode, context);
    }

    function parseSimpleIfStatement(ifStatement: ESTree.IfStatement, currentFlowNode: FlowNode, context: ConstructionContext): FlowNode {
        let ifNode = context.createNode().appendTo(currentFlowNode);
        let endOfIfBranch = parseStatement(ifStatement.consequent, ifNode, context);
        
        return context.createNode()
            .appendTo(currentFlowNode)
            .appendTo(endOfIfBranch);
    }

    function parseIfElseStatement(ifStatement: ESTree.IfStatement, currentFlowNode: FlowNode, context: ConstructionContext): FlowNode {
        let condition = ifStatement.test.type;
        
        let ifNode = context.createNode().appendTo(currentFlowNode, `Pos(${condition})`);
        let elseNode = context.createNode().appendTo(currentFlowNode, `Neg(${condition})`);
        
        let endOfIfBranch = parseStatement(ifStatement.consequent, ifNode, context);
        let endOfElseBranch = parseStatement(ifStatement.alternate, elseNode, context);
        
        return context.createNode()
            .appendTo(endOfIfBranch)
            .appendTo(endOfElseBranch);
    }
    
    function parseWhileStatement(whileStatement: ESTree.WhileStatement, currentFlowNode: FlowNode, context: ConstructionContext): FlowNode {
        let loopBodyNode = context.createNode().appendTo(currentFlowNode, "Pos");
        
        let endOfLoopBodyNode = parseStatement(whileStatement.body, loopBodyNode, context);
        currentFlowNode.appendTo(endOfLoopBodyNode);
        
        let finalNode = context.createNode().appendTo(currentFlowNode, "Neg");
        
        return finalNode;
    }
    
    function parseDoWhileStatement(whileStatement: ESTree.DoWhileStatement, currentFlowNode: FlowNode, context: ConstructionContext): FlowNode {
        let endOfLoopBodyNode = parseStatement(whileStatement.body, currentFlowNode, context);
        currentFlowNode.appendTo(endOfLoopBodyNode, "Pos");
        
        let finalNode = context.createNode().appendTo(endOfLoopBodyNode, "Neg");
        
        return finalNode;
    }
}
