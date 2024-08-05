export default function VerticalDivisor({ ...props }) {
  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        borderSpacing: 0,
      }}
    >
      <tbody>
        <tr>
          <td>
            <hr
              style={{
                border: 0,
                borderTop: '1px solid #d6d7d9',
                margin: 0,
              }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
