import { Button, Input } from "web3uikit"

export default function SendPostWorks({ _functionForInput }) {
    return (
        <div className="container">
            <div>
                <Input
                    placeholder="type your message...."
                    onChange={(evt) => {
                        _functionForInput(evt.target.value)
                    }}
                />
            </div>

            <div style={{ marginTop: 20, marginLeft: 110 }}>
                <Button
                    color="blue"
                    onClick={() => {
                        console.log(input)
                    }}
                    text="Send Post"
                    theme="colored"
                    size="l"
                />
            </div>
        </div>
    )
}
