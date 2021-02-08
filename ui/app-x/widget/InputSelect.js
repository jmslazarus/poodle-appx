import React, { useState, useContext, useEffect } from "react"
import PropTypes from 'prop-types'
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  TextField,
  MenuItem,
  IconButton,
  makeStyles,
  useTheme,
} from '@material-ui/core'
import {
  AddCircleOutline,
  RemoveCircleOutline,
} from '@material-ui/icons'
import {
  Controller,
  useFormContext,
} from 'react-hook-form'
import {
  AutoComplete,
} from 'antd'
import _ from 'lodash'
import InputScopeProvider from 'app-x/widget/InputScopeProvider'

const InputSelect = (props) => {
  // theme
  const theme = useTheme()
  // useFormContext
  const {
    register,
    unregister,
    errors,
    watch,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    setValue,
    getValues,
    trigger,
    control,
    formState,
  } = useFormContext()

  // basename and propsId
  const { basename } = useContext(InputScopeProvider.Context)
  const propsId = !!basename ? `${basename}.${props.id}` : props.id

  // rules
  const rules = props.rules || {}
  if (!!props.required) {
    rules.required = `${props.label || props.name} is required`
  }

  // not array
  return (
    <Box
      {...(props.BoxProps || {})}
      style={props.style}
      >
      <Controller
        key={propsId}
        name={propsId}
        required={!!props.required}
        constrol={control}
        defaultValue={props.defaultValue || ''}
        rules={rules}
        render={innerProps => (
          <FormControl
            name={propsId}
            style={{width:'100%'}}
            error={!!_.get(errors, propsId)}
            >
            {
              !!props?.label
              &&
              (
                <Box
                  style={{width: '100%', paddingBottom: theme.spacing(2)}}
                  >
                  <InputLabel
                    key="label"
                    shrink={true}
                    required={!!props.required}
                  >
                    { props.label }
                  </InputLabel>
                </Box>
              )
            }
            <TextField
              {...(props.TextProps || {})}
              name={propsId}
              select={true}
              required={!!props.required}
              style={{width:'100%'}}
              value={innerProps.value}
              onChange={e => {
                innerProps.onChange(e.target.value)
                if (!!props.callback) {
                  props.callback(e.target.value)
                }
              }}
              error={!!_.get(errors, propsId)}
              helperText={_.get(errors, propsId)?.message || ''}
              >
              <MenuItem style={{display:'none'}}
                key=''
                value=''
                >
              </MenuItem>
              {
                !!props.options
                &&
                (
                  props.options.map(option => {
                    return (
                      <MenuItem
                        key={option}
                        value={option}
                        >
                        { option }
                      </MenuItem>
                    )
                  })
                )
              }
            </TextField>
          </FormControl>
        )}
        >
      </Controller>
    </Box>
  )
}

InputSelect.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ),
  defaultValue: PropTypes.string,
  callback: PropTypes.func,
  BoxProps: PropTypes.object,
  TextProps: PropTypes.object,
  style: PropTypes.object,
  rules: PropTypes.object,
}

InputSelect.appxType = 'appx/input/select'

export default InputSelect
