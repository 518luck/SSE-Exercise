import { useState } from 'react'
import { Input, Form } from 'antd'
import icon from './assets/icon.svg'
import { SendOutlined } from '@ant-design/icons'

import styles from './App.module.scss'

const { TextArea } = Input
function App() {
  const [form] = Form.useForm()
  const [focus, setFocus] = useState(false)

  const handleSendClick = () => {
    const userInput = form.getFieldValue().chatText

    const eventSource = new EventSource(
      `http://localhost:3000/sse/stream?content=${encodeURIComponent(
        userInput
      )}`
    )
    eventSource.onmessage = (event) => {
      console.log('收到消息:', event.data)
    }
    eventSource.onerror = (err) => {
      if (eventSource.readyState === 2) {
        // 连接被服务器正常关闭
        console.log('SSE 连接已关闭')
      } else {
        // 其他错误
        console.error('SSE 连接出错:', err)
      }
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.headTitle}>
        <img
          src={icon}
          alt='icon'
          style={{
            width: 32,
            height: 32,
            verticalAlign: 'middle',
            marginRight: 8,
          }}
          className={styles.img}
        />
        <div>我是多云AI，很高兴见到你!</div>
        <span>
          我可以帮你写代码、读文件、写作各种创意内容，请把你的任务交给我吧~
        </span>
      </div>
      <div className={`${styles.context} ${focus ? styles.contextFocus : ''}`}>
        <Form form={form}>
          <Form.Item name='chatText'>
            <TextArea
              placeholder='给 多云AI 发送消息'
              className={styles.TextArea}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
            />
          </Form.Item>
          <div onClick={handleSendClick}>
            <SendOutlined rotate={-90} className={styles.SendOutlined} />
          </div>
        </Form>
      </div>
    </div>
  )
}

export default App
