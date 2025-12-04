/* eslint-disable no-undef */
const { capitalizeWords, filterActiveUsers, logAction } = require('../index');

describe ('capitalizeWords', () => {
    test('capitalizes each word in multi-word string', () => {
        expect(capitalizeWords('hello world')).toBe('Hello World');
    });

    test('handles empty string', () => {
        expect(capitalizeWords('')).toBe('');
    });

    test('handles special characters', () => {
        expect(capitalizeWords('hello-world')).toBe('Hello-World');
    });

    test('handles single word', () => {
        expect(capitalizeWords('hello')).toBe('Hello');
    });
});

describe('filterActiveUsers', () => {
    test('filters active users from mixed array', () => {
        const users = [
            { id: 1, name: 'Alice', isActive: true },
            { id: 2, name: 'Bob', isActive: false },
            { id: 3, name: 'Charlie', isActive: true }
        ];
    
        expect(filterActiveUsers(users)).toEqual([
            { id: 1, name: 'Alice', isActive: true },
            { id: 3, name: 'Charlie', isActive: true }
        ]);
    });

    test('returns empty array for all inactive users', () => {
        const users = [
            { id: 1, name: 'Alice', isActive: false },
            { id: 2, name: 'Bob', isActive: false }
        ];
    
        expect(filterActiveUsers(users)).toEqual([]);
    });

    test('returns empty array for empty input', () => {
        expect(filterActiveUsers([])).toEqual([]);
    });

    test('includes truthy isActive values', () => {
        const users = [
            { id: 1, name: 'Alice', isActive: true },
            { id: 2, name: 'Bob', isActive: 'yes' }
        ];
    
        expect(filterActiveUsers(users).length).toBe(2);
    });
});

describe('logAction', () => {
    test('generates correct log string for valid inputs', () => {
        const result = logAction('login', 'john_doe');
        expect(result).toMatch(/^User john_doe performed login at /);
        expect(result.split(' at ')[1]).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
    });

    test('handles empty strings as inputs', () => {
        const result1 = logAction('', 'john_doe');
        expect(result1).toMatch(/^User john_doe performed {2}at /);
    
        const result2 = logAction('login', '');
        expect(result2).toMatch(/^User {2}performed login at /);
    });

    test('handles missing parameters', () => {
        const result1 = logAction(undefined, 'john_doe');
        expect(result1).toMatch(/^User john_doe performed undefined at /);
    
        const result2 = logAction('login', undefined);
        expect(result2).toMatch(/^User undefined performed login at /);
    });

    test('timestamp is recent and valid', () => {
        const before = new Date();
        const result = logAction('test', 'user');
        const after = new Date();
    
        const timestamp = new Date(result.split(' at ')[1]);
        expect(timestamp).toBeInstanceOf(Date);
        expect(timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime() - 1000);
        expect(timestamp.getTime()).toBeLessThanOrEqual(after.getTime() + 1000);
    });
});