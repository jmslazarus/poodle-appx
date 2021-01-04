import {
  REGEX_VAR,
  types
} from 'app-x/spec/types'

// type: js/reduce                                   (~expression)
// data:                     # input data            (:expression)
// reducer:                  # return expression     (:expression)
// init:                     # init data             (:expression)
const js_reduce = {

  name: 'js/reduce',
  desc: 'Reduce',
  types: [
    {
      type: 'expression',
    },
  ],
  children: [
    {
      name: 'data',
      desc: 'Data',
      types: [
        {
          type: 'expression'
        },
      ],
    },
    {
      name: 'reducer',
      desc: 'Reducer',
      types: [
        {
          type: 'expression'
        }
      ],
      _variants: [
        {
          variant: 'js/expression'
        }
      ],
    },
    {
      name: 'init',
      desc: 'Initial Value',
      types: [
        {
          type: 'expression'
        },
      ],
      _variants: [
        {
          variant: 'js/expression'
        }
      ],
    },
  ]
}

export default js_reduce