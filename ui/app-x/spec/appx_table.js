import {
  REGEX_VAR,
  classes
} from 'app-x/spec/classes.js'

// type: appx/table                                  (~jsx|~expression)
// name:                     # name of the form      (:string)
// data:                     # table data            (:string|:expression)
// columns:                  # column options        (:array<:appx/table/column>)
// toolbar:                  # toolbar               (:jsx)
// rowPanel                  # row panel             (:jsx)
// style:                    # style for container   (:object<:expression>)
// color:                    # color                 (primary|secondary)
// hideToolbar:              # hide toolbar?         (:boolean)
// hasFooter:                # has footer?           (:boolean)
// defaultPageSize:          # default page size     (:number)
export const appx_table = {

  type: 'appx/table',
  desc: 'App-X Table',
  template: {
    kind: 'react/element',
  },
  _expand: true,
  children: [
    {
      name: 'name',
      desc: 'Name',
      required: true,
      types: [
        {
          kind: 'class',
          data: 'string'
        },
      ],
      _thisNode: {
        types: 'inherit',
        input: {
          kind: 'input/text',
          options: 'validation.valid_import_names()',
          optionSelfImportNames: true,
          optionsOnly: true,
        },
      },
    },
    {
      name: 'data',
      desc: 'Data',
      types: [
        {
          kind: 'class',
          data: 'string',
          parse: true,
        },
        {
          kind: 'class',
          data: 'array'
        },
      ],
      _thisNode: {
        types: [
          {
            kind: 'class',
            data: 'string'
          },
        ],
        input: {
          kind: 'input/expression',
        }
      },
      _childNode: {
        types: [
          {
            kind: 'class',
            data: 'array'
          },
        ],
      },
    },
    {
      name: 'columns',
      desc: 'Columns',
      array: true,
      types: [
        {
          kind: 'type',
          data: 'appx/table/column'
        },
      ],
      _childNode: {
        types: 'inherit',
      },
    },
    {
      name: 'toolbar',
      desc: 'Toolbar',
      types: [
        {
          kind: 'class',
          data: 'jsx'
        },
      ],
      _childNode: {
        types: 'inherit',
      },
    },
    {
      name: 'rowPanel',
      desc: 'Row Panel',
      types: [
        {
          kind: 'type',
          data: 'react/element',
          expr: '({row}) => $child'
        },
      ],
      context: [
        {
          name: 'row',
          desc: 'row data - e.g. row.original'
        }
      ],
      _childNode: {
        types: 'inherit',
      },
    },
    {
      name: 'style',
      desc: 'Style',
      types: [
        {
          kind: 'class',
          data: 'object'
        },
      ],
      _childNode: {
        types: 'inherit',
        input: {
          kind: 'input/properties',
          options: 'validation.valid_css_properties()',
        },
      },
    },
    {
      name: 'color',
      desc: 'Color',
      types: [
        {
          kind: 'class',
          data: 'string'
        },
      ],
      _thisNode: {
        types: 'inherit',
        input: {
          kind: 'input/text',
          options: [
            'primary',
            'secondary',
          ]
        },
      },
    },
    {
      name: 'hideToolbar',
      desc: 'Hide Toolbar',
      types: [
        {
          kind: 'class',
          data: 'boolean'
        },
      ],
      _thisNode: {
        types: 'inherit',
        input: {
          kind: 'input/switch',
        },
      },
    },
    {
      name: 'hasFooter',
      desc: 'Has Footer',
      types: [
        {
          kind: 'class',
          data: 'boolean'
        },
      ],
      _thisNode: {
        types: 'inherit',
        input: {
          kind: 'input/switch',
        },
      },
    },
    {
      name: 'defaultPageSize',
      desc: 'Default Page Size',
      types: [
        {
          kind: 'class',
          data: 'number'
        },
      ],
      _thisNode: {
        types: 'inherit',
        input: {
          kind: 'input/text',
          variant: 'number',
        },
      },
    },
  ]
}

export default appx_table
