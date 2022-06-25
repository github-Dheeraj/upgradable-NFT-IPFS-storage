import { Web3Storage } from 'web3.storage'

function getAccessToken () {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEFDQzI4ZjM2MUY1MEYwMDRkMDhlQzQ5NjA3OGUyNkY2MjkzMzc1QjMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTQxNjUwNjM2MjcsIm5hbWUiOiJuZnRTdG9yYWdlIn0.tahXtWJGHQfsguCH7VMFc-zaNH_9JMQlMsUi1HgemW0'

}

export default function makeStorageClient () {
    return new Web3Storage({ token: getAccessToken() })
}