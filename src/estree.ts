module ESTree {
    export class NodeType {
        static ArrayExpression= "ArrayExpression";
        static AssignmentExpression = "AssignmentExpression";
        static BinaryExpression = "BinaryExpression"
        static BlockStatement = "BlockStatement";
        static BreakStatement = "BreakStatement"
        static CallExpression = "CallExpression";
        static ContinueStatement = "ContinueStatement";
        static DebuggerStatement = "DebuggerStatement";
        static DoWhileStatement = "DoWhileStatement";
        static EmptyStatement = "EmptyStatement";
        static ExpressionStatement = "ExpressionStatement";
        static ForStatement = "ForStatement";
        static ForInStatement = "ForInStatement";
        static Identifier = "Identifier";
        static IfStatement = "IfStatement";
        static LabeledStatement = "LabeledStatement";
        static Literal = "Literal";
        static LogicalExpression = "LogicalExpression";
        static MemberExpression = "MemberExpression";
        static NewExpression = "NewExpression";
        static ObjectExpression = "ObjectExpression";
        static Program = "Program";
        static SequenceExpression = "SequenceExpression";
        static ThisExpression = "ThisExpression";
        static UnaryExpression = "UnaryExpression";
        static UpdateExpression = "UpdateExpression";
        static VariableDeclaration = "VariableDeclaration";
        static WhileStatement = "WhileStatement";
        static WithStatement = "WithStatement";
    }
    
    
    // Node objects

    export interface Node {
        type: string;
    }

    
    // Programs

    export interface Program extends Node {
        body: Statement[];
    }


    // Statements

    export interface Statement extends Node {

    }
    
    export interface EmptyStatement extends Statement {
        
    }
    
    export interface BlockStatement extends Statement {
        body: Statement[];
    }
    
    export interface ExpressionStatement extends Statement {
        expression: Expression;
    }
    
    export interface IfStatement extends Statement {
        test: Expression;
        consequent: Statement;
        alternate: Statement;
    }
    
    export interface LabeledStatement extends Statement {
        label: Identifier;
        body: Statement;
    }
    
    export interface BreakStatement extends Statement {
        label: Identifier;
    }
    
    export interface ContinueStatement extends Statement {
        label: Identifier;
    }
    
    export interface WithStatement extends Statement {
        object: Expression;
        body: Statement;
    }
    
    export interface WhileStatement extends Statement {
        test: Expression;
        body: Statement;
    }
    
    export interface DoWhileStatement extends Statement {
        test: Expression;
        body: Statement;
    }
    
    export interface ForStatement extends Statement {
        init: VariableDeclaration | Expression;
        test: Expression;
        update: Expression;
        body: Statement;
    }
    
    export interface ForInStatement extends Statement {
        left: VariableDeclaration;
        right: Expression;
        body: Statement;
    }
    
    export interface DebuggerStatement extends Statement {
        
    }
    
    
    // Declarations
    
    export interface Declaration extends Statement {
        
    }
    
    export interface VariableDeclaration extends Declaration {
        declarations: VariableDeclarator[];
    }
    
    export interface VariableDeclarator extends Node {
        id: Identifier;
        init: Expression;
    }
    
    
    // Expressions 
    
    export interface Expression extends Node {
        
    }
    
    export interface ThisExpression extends Expression {
        
    }
    
    export interface ArrayExpression extends Expression {
        elements: Expression[];
    }
    
    export interface ObjectExpression extends Expression {
        properties: Property[];
    }
    
    export interface Property extends Node {
        key: Literal | Identifier;
        value: Expression;
        kind: string;
    }
    
    export interface SequenceExpression extends Expression {
        expressions: Expression[];
    }
    
    export interface UnaryExpression extends Expression {
        operator: string;
        prefix: boolean;
        argument: Expression;
    }
    
    export interface BinaryExpression extends Expression {
        operator: string;
        left: Expression;
        right: Expression;
    }
    
    export interface AssignmentExpression extends Expression {
        operator: string;
        left: Identifier | Expression;
        right: Expression;
    }
    
    export interface UpdateExpression extends Expression {
        operator: string;
        argument: Expression;
        prefix: boolean;
    }
    
    export interface LogicalExpression extends Expression {
        operator: string;
        left: Expression;
        right: Expression;
    }
    
    export interface CallExpression extends Expression {
        callee: Expression;
        arguments: Expression[];
    }
    
    export interface NewExpression extends CallExpression {
        
    }
    
    export interface MemberExpression extends Expression, Identifier {
        object: Expression;
        property: Expression;
        computed: boolean;
    }
    
    
    // Miscellaneous
    
    export interface Identifier extends Node, Expression {
        name: string;
    }
    
    export interface Literal extends Node, Expression {
        value: string | boolean | number | RegExp;
    }
}
