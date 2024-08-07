import AddTags from './add-tag';
import TagItem from './tag-item';
import { COLORS_Nota_TEMPLATES } from '../../templates/template-layout';

function TagsLayout({ children, ...props }: any) {
  return (
    <table
      cellSpacing="2"
      style={{
        width: 'fit-content',
        borderCollapse: 'collapse',
        borderSpacing: '0',
      }}
    >
      <tr>{children}</tr>
    </table>
  );
}

export default function Tags({ ...props }: any) {
  return (
    <TagsLayout {...props}>
      {props.variant === 'tags' &&
        props.tags.map((tag: any, index: number) => (
          <>
            <TagItem
              key={tag.id}
              {...props}
              tag={tag}
              isEmail={props.isEmail}
              color={COLORS_Nota_TEMPLATES[index % 2 === 0 ? 0 : 1]}
            />
            <td style={{ width: '11px' }}> </td>
          </>
        ))}
      {!props.isEmail && <AddTags {...props} />}
    </TagsLayout>
  );
}
