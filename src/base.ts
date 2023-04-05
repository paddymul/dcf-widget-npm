import React from 'react';

/**
 * Field type
 *
 * `id` means a hidden field that will be carried on by react-edit-list without any processing
 *
 * `string` and `number` have default rendering and input components
 *
 * `custom` allows you to define your own rendering and input components
 *
 * Passing an array of `name`/`value` pairs allows defining of an enum field
 */
export type Element =
    | 'id'
    | 'string'
    | 'number'
    | {name: string; value: string | undefined}[]
    | 'custom';

export type Value = unknown;

/**
 * Schema for the data
 */
export type Schema = {name: string; type: Element}[];
