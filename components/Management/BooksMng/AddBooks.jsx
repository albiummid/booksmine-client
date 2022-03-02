import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'
import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  Tooltip,
  Typography,
} from 'antd'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import API from '../../../API/API'
import Authorize from '../../../utils/Authorize'
import {
  ButtonSubmit,
  FileUpload,
  InputText,
  NumberInput,
  SelectOption,
} from '../../Layout/Elements.styles'
import ExtraOption from '../../Layout/ExtraOption'
export const FormGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`

export const categoryList = [
  {
    title: 'Self Development and Learning',
  },
  {
    title: 'Islamic',
  },
  {
    title: 'Literature',
  },
  {
    title: 'Childrens book',
  },
]

const AddBooks = ({ refetcher, editId, form, isAcademic }) => {
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(null)
  const [allDept, setAllDept] = useState([])
  const [allSemester, setAllSemester] = useState([])
  const [allCourse, setAllCourse] = useState([])
  const [allCatagories, setAllCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setLoading(true)
    API.get(`/department/all`)
      .then(({ data }) => {
        setAllDept(data.departments)
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
    API.get('/category/all')
      .then(({ data }) => {
        console.log(data)
        setAllCategories(data.categories)
      })
      .catch((err) => console.log(err))
  }, [])

  const { Option } = Select

  const handleFinish = async (data) => {
    const price =
      data.originalPrice - (data.originalPrice * data.discount) / 100
    const category = isAcademic ? 'academic' : data.category
    const isStock = data.inStock > 0 ? true : false
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('author', data.author)
    formData.append('price', price)
    formData.append('originalPrice', data.originalPrice)
    formData.append('discount', data.discount)
    formData.append('ratings', 0)
    formData.append('inStock', data.inStock)
    formData.append('isStock', isStock)
    formData.append('imgUrl', data.imgUrl)
    formData.append('category', category)
    formData.append('summary', data.summary)
    if (isAcademic) {
      formData.append('semester', data.semester)
      formData.append('department', data.department)
      formData.append('courseCode', data.courseCode)
    }

    if (image) {
      formData.append('file', image)
    }
    if (isImageFile && !image) {
      toast.error('Did not select any image')
    }
    if (editId) {
      setLoading(true)
      API.patch(`/book/${editId}`, formData)
        .then((res) => {
          toast.success('Successfully Updated')
          refetcher(true)
          setImage(null)
        })
        .catch((err) => {
          refetcher(true)
          setImage(null)
          console.log(err)
          toast.error('Updating data failed!', 4)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(true)
      API.post(`${'/book/add'}`, formData)
        .then((res) => {
          setImage(null)
          refetcher(true)
        })
        .catch((err) => {
          refetcher()
          setImage(null)
          console.log(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const onChange = (e) => {
    setImage(e.file.originFileObj)
  }
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }

  const [isImageFile, setIsImageFile] = useState(true)
  useEffect(() => {
    if (editId?.length) {
      setIsImageFile(false)
    } else {
      setIsImageFile(true)
    }
  }, [editId])

  const addCategory = async () => {
    // setAllCategories([...allCatagories, { title: newCategory }])
    try {
      const { data } = await API.post('/category/', { title: newCategory })
      setAllCategories([...allCatagories, data.category])
    } catch (err) {
      console.log(err)
    }
  }
  const deleteCategory = async (_id) => {
    try {
      const { data } = await API.delete('/category/' + _id)
      setAllCategories(data.categories)
      toast.success('successfully deleted')
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <>
      <>
        {isAcademic ? (
          <>
            <Form form={form} onFinish={handleFinish}>
              <b>Book Name:</b>
              <Form.Item
                rules={[{ required: true }]}
                // style={{ width: '400px' }}
                name='title'
              >
                <InputText size='small' placeholder='Book Name' />
              </Form.Item>

              <b>Author:</b>
              <Form.Item
                rules={[{ required: true }]}
                name='author'
                // style={{ width: '400px' }}
              >
                <InputText size='small' placeholder='Author Name' />
              </Form.Item>
              <b>Department:</b>

              <Form.Item
                rules={[{ required: true }]}
                title='department'
                name='department'
              >
                <SelectOption defaultValue={'Select Department'}>
                  {allDept?.map((data) => (
                    <Option key={data._id} value={data?.name}>
                      <Typography
                        onClick={() => {
                          setAllSemester(data?.semesters) || []
                        }}
                      >
                        {data?.name}
                      </Typography>
                    </Option>
                  ))}
                </SelectOption>
              </Form.Item>
              <FormGroup>
                <div>
                  <b>Semester:</b>
                  <Form.Item
                    style={{ width: '200px' }}
                    rules={[{ required: true }]}
                    name='semester'
                  >
                    <SelectOption defaultValue='Select Semester'>
                      {allSemester?.map((data) => (
                        <Option key={data._id} value={data.title}>
                          <Typography
                            onClick={() => {
                              setAllCourse(data?.courses || [])
                            }}
                          >
                            {data.title}
                          </Typography>
                        </Option>
                      ))}
                    </SelectOption>
                  </Form.Item>
                </div>

                <div>
                  <b>CourseCode:</b>
                  <Form.Item
                    title='courseCode'
                    name='courseCode'
                    style={{ width: '200px' }}
                    rules={[{ required: true }]}
                  >
                    <SelectOption
                      defaultValue={'Select CourseCode'}
                      loading={loading}
                    >
                      {allCourse?.map((data) => (
                        <Option key={data._id} value={data?.courseCode}>
                          <Tooltip align='top-left' title={data.title}>
                            <Typography>{data?.courseCode}</Typography>
                          </Tooltip>
                        </Option>
                      ))}
                    </SelectOption>
                  </Form.Item>
                </div>
              </FormGroup>
              <FormGroup>
                <div>
                  <b>Price:</b>
                  <Form.Item rules={[{ required: true }]} name='originalPrice'>
                    <NumberInput min={0} placeholder='Price' />
                  </Form.Item>
                </div>
                <div>
                  <b>Discount:</b>

                  <Form.Item rules={[{ required: true }]} name='discount'>
                    <NumberInput placeholder='Discount percentage' />
                  </Form.Item>
                </div>
              </FormGroup>
              <FormGroup>
                <div>
                  <b>In Stock? :</b>
                  <Form.Item rules={[{ required: true }]} name='inStock'>
                    <NumberInput placeholder='Stock limit' />
                  </Form.Item>
                </div>
                <div>
                  <Radio.Group
                    style={{ margin: '0 auto' }}
                    size='small'
                    options={[
                      { label: 'Insert Link', value: false },
                      { label: 'Upload File', value: true },
                    ]}
                    value={isImageFile}
                    optionType='button'
                    buttonStyle='solid'
                    onChange={(e) => setIsImageFile(e.target.value)}
                  />

                  {isImageFile ? (
                    <div style={{ margin: '5px' }}>
                      <Form.Item
                        valuePropName='fileList'
                        getValueFromEvent={normFile}
                        rules={[{ required: true }]}
                        style={{ width: '200px' }}
                      >
                        <FileUpload
                          name='img'
                          listType='picture'
                          maxCount={1}
                          customRequest={dummyRequest}
                          onChange={onChange}
                        >
                          <Button style={{ width: '200px' }}>
                            Upload <UploadOutlined />
                          </Button>
                        </FileUpload>
                      </Form.Item>
                    </div>
                  ) : (
                    <div style={{ marginTop: '5px' }}>
                      <Form.Item
                        style={{ width: '200px' }}
                        name='imgUrl'
                        rules={[{ required: true }]}
                      >
                        <InputText placeholder='Input New Image Link' />
                      </Form.Item>
                    </div>
                  )}
                </div>
              </FormGroup>

              <div className='flex my-4'>
                <ButtonSubmit
                  size='large'
                  loading={loading}
                  disabled={(isImageFile && !image) || loading}
                  htmlType='submit'
                >
                  {editId ? 'Update' : 'Create'}
                </ButtonSubmit>
              </div>
            </Form>
          </>
        ) : (
          <>
            <Form form={form} onFinish={handleFinish}>
              <h3>Book Name:</h3>
              <Form.Item
                rules={[{ required: true }]}
                // style={{ width: '400px' }}
                name='title'
              >
                <InputText size='small' placeholder='Book Name' />
              </Form.Item>

              <h3>Author:</h3>
              <Form.Item
                rules={[{ required: true }]}
                name='author'
                // style={{ width: '400px' }}
              >
                <InputText size='small' placeholder='Author Name' />
              </Form.Item>
              <h3>Category:</h3>

              <div className='flex justify-between  w-[100%]'>
                <Form.Item
                  rules={[{ required: true }]}
                  title='department'
                  name='category'
                >
                  <SelectOption
                    style={{ width: '400px' }}
                    defaultValue={'Select Category'}
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Divider style={{ margin: '8px 0' }} />
                        <Space className='flex justify-center gap-4 my-2'>
                          <Input
                            placeholder='Please enter item'
                            onChange={(e) => setNewCategory(e.target.value)}
                          />
                          <Button
                            onClick={addCategory}
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            <PlusOutlined /> Add item
                          </Button>
                        </Space>
                      </>
                    )}
                  >
                    {allCatagories?.map((item, i) => (
                      <ExtraOption
                        onClick={() => {
                          console.log('D')
                        }}
                        value={item.title}
                        key={i}
                      >
                        {item.title}
                      </ExtraOption>
                    ))}
                  </SelectOption>
                </Form.Item>
                <Authorize roleFor={['admin', 'developer']}>
                  <DeleteOutlined
                    className='font-bold text-3xl opacity-75 hover:opacity-100 cursor-pointer text-red-500'
                    onClick={() => {
                      setVisible(true)
                    }}
                  />
                </Authorize>
                <Modal
                  title='Delete Category'
                  visible={visible}
                  cancelButtonProps={false}
                  onOk={() => setVisible(false)}
                  onCancel={() => setVisible(false)}
                  okText='Done'
                  cancelText='Cancel'
                >
                  {allCatagories.length ? (
                    <>
                      {allCatagories?.map((item) => (
                        <div
                          key={item._id}
                          className='flex justify-between mx-2 shadow-lg my-2 p-2'
                        >
                          <p>{item.title}</p>

                          <DeleteOutlined
                            onClick={() => deleteCategory(item._id)}
                            className='text-red-400 text-2xl'
                          />
                        </div>
                      ))}
                    </>
                  ) : (
                    <div>No Categories !</div>
                  )}
                </Modal>
              </div>

              <FormGroup>
                <div className='w-100'>
                  <b>Summary:</b>
                  <Form.Item rules={[{ required: true }]} name='summary'>
                    <Input.TextArea
                      bordered={true}
                      placeholder='Write summary about this book! '
                      // autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                  </Form.Item>
                </div>
              </FormGroup>
              <FormGroup>
                <div>
                  <b>Price:</b>
                  <Form.Item rules={[{ required: true }]} name='originalPrice'>
                    <NumberInput min={0} placeholder='Price' />
                  </Form.Item>
                </div>
                <div>
                  <b>Discount:</b>

                  <Form.Item rules={[{ required: true }]} name='discount'>
                    <NumberInput placeholder='Discount percentage' />
                  </Form.Item>
                </div>
              </FormGroup>
              <FormGroup>
                <div>
                  <b>In Stock? :</b>
                  <Form.Item rules={[{ required: true }]} name='inStock'>
                    <NumberInput placeholder='Stock limit' />
                  </Form.Item>
                </div>
                <div>
                  <Radio.Group
                    style={{ margin: '0 auto' }}
                    size='small'
                    options={[
                      { label: 'Insert Link', value: false },
                      { label: 'Upload File', value: true },
                    ]}
                    value={isImageFile}
                    optionType='button'
                    buttonStyle='solid'
                    onChange={(e) => setIsImageFile(e.target.value)}
                  />

                  {isImageFile ? (
                    <div style={{ margin: '5px' }}>
                      <Form.Item
                        valuePropName='fileList'
                        getValueFromEvent={normFile}
                        rules={[{ required: true }]}
                        style={{ width: '200px' }}
                      >
                        <FileUpload
                          name='img'
                          listType='picture'
                          maxCount={1}
                          customRequest={dummyRequest}
                          onChange={onChange}
                        >
                          <Button style={{ width: '200px' }}>
                            Upload <UploadOutlined />
                          </Button>
                        </FileUpload>
                      </Form.Item>
                    </div>
                  ) : (
                    <div style={{ marginTop: '5px' }}>
                      <Form.Item
                        style={{ width: '200px' }}
                        name='imgUrl'
                        rules={[{ required: true }]}
                      >
                        <InputText placeholder='Input New Image Link' />
                      </Form.Item>
                    </div>
                  )}
                </div>
              </FormGroup>

              <div className='flex my-4'>
                <ButtonSubmit
                  size='large'
                  loading={loading}
                  disabled={(isImageFile && !image) || loading}
                  htmlType='submit'
                >
                  {editId ? 'Update' : 'Create'}
                </ButtonSubmit>
              </div>
            </Form>
          </>
        )}
      </>
    </>
  )
}

export default AddBooks
