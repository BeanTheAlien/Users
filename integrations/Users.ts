type UFieldBase = "string" | "num" | "int" | "float" | "bool" | "json";
type UField = UFieldBase | `${UFieldBase}[]`;

type IntType = number & { __brand: "int" };
type FloatType = number & { __brand: "float" };

// Simplified FieldType using template literal pattern matching
type ScalarType<T extends UFieldBase> = 
    T extends "string" ? string :
    T extends "num" ? number :
    T extends "int" ? IntType :
    T extends "float" ? FloatType :
    T extends "bool" ? boolean :
    T extends "json" ? object :
    never;

type FieldType<T extends UField> = T extends `${infer Base extends UFieldBase}[]`
    ? ScalarType<Base>[]
    : T extends UFieldBase
    ? ScalarType<T>
    : never;

// Define the shape of method return types that every implementation must provide
export interface RMap<Field> {
    get: any;
    set: any;
    upd: any;
    del: any;
}

// Default return shape fallback if an implementation doesn't specify custom wrappers
export interface DRMap<Field> extends RMap<Field> {
    get: Field;
    set: boolean;
    upd: boolean;
    del: boolean;
}
type COpr = "=" | "!=";

export default abstract class Users<
    RawField extends Record<string, UField>,
    Field = { [K in keyof RawField]: FieldType<RawField[K]> },
    TReturns extends RMap<Field> = DRMap<Field>
> {
    /**
     * Gets a user from the database and returns the result.
     * 
     * Accepts an ID (specifically the primary key) to be used when
     * trying to find the user.
     * @param id The ID (primary key) of the user to retrieve.
     */
    abstract get(id: string): Promise<TReturns["get"]>;
    /**
     * Gets a user from the database and returns the result.
     * 
     * Returns the user from the given relational comparison.
     * @param column The key to test.
     * @param operator The comparison (relational) operator to use.
     * @param value The value to test with.
     */
    abstract get<K extends keyof Field>(column: K, operator: COpr, value: Field[K]): Promise<TReturns["get"]>;
    /**
     * Appends a new user to the table and returns a result.
     * 
     * Takes in the data that should be used.
     * 
     * Creates a new entry. For updating entries, see {@link upd}.
     * @param data The user data to be used.
     */
    abstract set(data: Partial<Field>): Promise<TReturns["set"]>;
    /**
     * Returns whether a user exists with the given ID.
     * @param id The ID (primary key) of the user.
     */
    abstract has(id: string): Promise<boolean>;
    /**
     * Returns whether a user exists with the given relational comparison.
     * @param column The key to test.
     * @param operator The comparison (relational) operator to use.
     * @param value The value to test with.
     */
    abstract has<K extends keyof Field>(column: K, operator: COpr, value: Field[K]): Promise<boolean>;
    /**
     * Applies new data to any user with the given ID.
     * @param id The user ID (primary key) to test.
     * @param applyData The new data to be applied.
     */
    abstract upd(id: string, applyData: Partial<Field>): Promise<TReturns["upd"]>;
    /**
     * Applies new data to any user who matches the relational comparison.
     * @param column The key to test.
     * @param operator The comparison (relational) operator.
     * @param value The value to test with.
     * @param applyData The new data to be applied.
     */
    abstract upd<K extends keyof Field>(column: K, operator: COpr, value: Field[K], applyData: Partial<Field>): Promise<TReturns["upd"]>;
    /**
     * Drops (deletes) user(s) from the database and returns the result (usually an error).
     * @param id The user ID (primary key) to drop.
     */
    abstract del(id: string): Promise<TReturns["del"]>;
    /**
     * Drops user(s) that succeeds in the relational comparison.
     * @param column The key to test.
     * @param operator The comparison (relational) operator.
     * @param value The value to test with.
     */
    abstract del<K extends keyof Field>(column: K, operator: COpr, value: Field[K]): Promise<TReturns["del"]>;
}