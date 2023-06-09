# react-edit-list

[![License: ISC](https://img.shields.io/github/license/mmomtchev/react-edit-list)](https://github.com/mmomtchev/react-edit-list/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/react-edit-list)](https://www.npmjs.com/package/react-edit-list) [![Node.js CI](https://github.com/mmomtchev/react-edit-list/workflows/Node.js%20CI/badge.svg)](https://github.com/mmomtchev/react-edit-list/actions?query=workflow%3A%22Node.js+CI%22) [![codecov](https://codecov.io/gh/mmomtchev/react-edit-list/branch/main/graph/badge.svg?token=ZHVvNADJrZ)](https://codecov.io/gh/mmomtchev/react-edit-list)

Universal Editable List React Component

`react-edit-list` allows for easy creation of editable lists in React that can be interfaced with a database

*   Fully customizable
*   Zero-dependency
*   Supports async callbacks for calling externals APIs
*   Supports input validation
*   Supports optional `null` fields
*   Supports custom field types

# Installation

```shell
npm i --save react-edit-layers
```

# Usage

Refer to the [examples](https://mmomtchev.github.io/react-edit-list/)

![screenshot](https://raw.githubusercontent.com/mmomtchev/react-edit-list/main/screen-animation.gif)

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

*   [Element](#element)
*   [Schema](#schema)

## Element

Field type

`id` means a hidden field that will be carried on by react-edit-list without any processing

`string` and `number` have default rendering and input components

`custom` allows you to define your own rendering and input components

Passing an array of `name`/`value` pairs allows defining of an enum field

Type: (`"id"` | `"string"` | `"number"` | [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<{name: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), value: ([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined))}> | `"custom"`)

## Schema

Schema for the data

Type: [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<{name: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), type: [Element](#element)}>
