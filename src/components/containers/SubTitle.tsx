import "./SubTitle.css"
import { Link } from 'react-router-dom'

interface SubTitleProps {
    info: any;
}

const SubTitleContainer = (props: SubTitleProps) => {
    return (
        <div className="sub-title-container">
            <h2>{props.info}</h2>
        </div>
    )
}

export default SubTitleContainer