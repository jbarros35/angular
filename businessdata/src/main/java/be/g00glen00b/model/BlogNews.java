package be.g00glen00b.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class BlogNews {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int newId;

	@Column
	private boolean active;

	@Column
	private String title;

	@Column
	private String imageUrl;

	@Column
	private Date postDate;

	public int getNewId() {
		return newId;
	}

	public void setNewId(int newId) {
		this.newId = newId;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public Date getPostDate() {
		return postDate;
	}

	public void setPostDate(Date postDate) {
		this.postDate = postDate;
	}

}
