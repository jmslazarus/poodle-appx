const PATH_SEPARATOR = '/'
const VARIABLE_SEPARATOR = '.'

////////////////////////////////////////////////////////////////////////////////
// primitive test
function isPrimitive(test) {
    return (test !== Object(test))
}

// parse variable full path
function parse_var_full_path(var_full_path) {

  let import_paths = var_full_path.split(PATH_SEPARATOR)
  let sub_vars = import_paths[import_paths.length - 1].split(VARIABLE_SEPARATOR)

  // add first sub_var to import_path
  import_paths[import_paths.length - 1] = sub_vars.shift()

  return {
    full_paths: [].concat(import_paths, sub_vars),
    import_paths: import_paths,
    sub_vars: sub_vars
  }
}

////////////////////////////////////////////////////////////////////////////////

// lookup data type
const lookup_data_type = (data) => {
  // get data type
  let dataType = ''
  if (isPrimitive(data)) {
    switch(typeof data) {
      case 'string':
        return 'js/string'
      case 'number':
        return 'js/number'
      case 'boolean':
        return 'js/boolean'
      case 'undefined':
        return 'js/null'
      case 'object':
        if (data === null)
          return 'js/null'
        else
          throw new Error(`ERROR: unexpected primitive data type [${data}]`)
    }
  }

  if (Array.isArray(data)) {
    return 'js/array'
  }

  if (!data._type) {
    return 'js/object'
  }

  return data._type
}

// enrich_primitive_data
const enrich_primitive_data = (data) => {
  if (isPrimitive(data)) {
    return {
      _type: lookup_data_type(data),
      data: data
    }
  } else {
    return data
  }
}

// check if data type matches the match spec
const type_matches_spec = (type, matchSpec) => {
  // if no class in matchSpec
  if (!matchSpec?.class) {
    return false
  }
  // check classSpec
  if (!globalThis.appx?.SPEC?.classes[matchSpec.class]) {
    return false
  }
  // get classSpec
  const classSpec = globalThis.appx.SPEC.classes[matchSpec.class]
  if (!classSpec.types.includes(type)) {
    return false
  }
  // check includes flag
  if (!!matchSpec.includes) {
    if (!matchSpec.includes.includes(type)) {
      return false
    }
  }
  // check excludes flag
  if (!!matchSpec.excludes) {
    if (matchSpec.excludes.includes(type)) {
      return false
    }
  }
  // we have passed all checks
  return true
}

// check if data type matches the match spec
const data_matches_spec = (data, matchSpec) => {
  const data_type = lookup_data_type(data)
  return type_matches_spec(data_type, matchSpec)
}

////////////////////////////////////////////////////////////////////////////////
// api methods
const api_methods = [
  'get',
  'post',
  'put',
  'delete',
  'head',
  'patch',
]

// return a list of valid html tags
function valid_api_methods() {
  return api_methods
}

////////////////////////////////////////////////////////////////////////////////
// https://html.spec.whatwg.org/#elements-3
const html_tags = [
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'bdi',
  'bdo',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hgroup',
  'hr',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'menu',
  'meta',
  'meter',
  'nav',
  'noscript',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'script',
  'section',
  'select',
  'slot',
  'small',
  'source',
  'span',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'template',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'u',
  'ul',
  'var',
  'video',
  'wbr'
]

// return a list of valid html tags
function valid_html_tags() {
  return html_tags.sort()
}

////////////////////////////////////////////////////////////////////////////////
// stores a list of valid import_names
const _valid_import_data = {}
const _valid_import_names = []

// load valid import names
function load_valid_import_data() {

  if (!globalThis.appx?.IMPORT_MAPS) {
    throw new Error(`ERROR: appx.IMPORT_MAPS not set`)
  }

  const libs = globalThis.appx?.IMPORT_MAPS.libs
  if (libs) {
    // iterate libs
    Object.keys(libs).map(lib_key => {
      const path = libs[lib_key].path
      // import lib path
      import(path).then(path_module => {
        // load module
        const modules = libs[lib_key].modules
        if (modules && modules.length) {
          // iterate modules
          modules.map(module_name => {
            // console.log(module_name)
            const module_content = path_module['default'][module_name]
            if (typeof module_content === 'object' && module_content) {
              // console.log(module_content)
              Object.keys(module_content).map(variable_name => {
                if (variable_name === 'default') {
                  // add default
                  _valid_import_data[module_name] = {
                    title: module_name,
                    module: module_name,
                    variable: variable_name,
                  }
                }
                const title = module_name + VARIABLE_SEPARATOR + variable_name
                _valid_import_data[title] = {
                  title: title,
                  module: module_name,
                  variable: variable_name,
                }
              })
            }
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
    })
  }

  // load appx
  if (!!globalThis.appx?.APPX_PATHS?.paths) {
    globalThis.appx.APPX_PATHS.paths.map(path => {
      // import lib path
      // console.log(path)
      import(PATH_SEPARATOR + path)
      .then(path_module => {
        // console.log(path_module)
        const module_name = path
        Object.keys(path_module).map(variable_name => {
          if (variable_name === 'default') {
            // add default
            _valid_import_data[module_name] = {
              title: module_name,
              module: module_name,
              variable: variable_name,
            }
          }
          const title = module_name + VARIABLE_SEPARATOR + variable_name
          _valid_import_data[title] = {
            title: title,
            module: module_name,
            variable: variable_name,
          }
        })
      })
      .catch(error => {
        console.log(error)
      })
    })
  }

}

load_valid_import_data()

// return a list of valid import names
function valid_import_names() {
  // if import data is not initialized
  if (!_valid_import_names.length) {
    Object.keys(_valid_import_data).sort().map(key => {
      _valid_import_names.push(key)
    })
    console.log(`valid_import_names`, _valid_import_names.length)
  }
  return _valid_import_names
}

////////////////////////////////////////////////////////////////////////////////
// export
export {
  PATH_SEPARATOR,
  VARIABLE_SEPARATOR,
  isPrimitive,
  parse_var_full_path,
  lookup_data_type,
  // enrich_primitive_data,
  type_matches_spec,
  data_matches_spec,
  valid_api_methods,
  valid_import_names,
  valid_html_tags,
}
